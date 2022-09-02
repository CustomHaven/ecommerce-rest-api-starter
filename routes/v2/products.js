const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();
const { isAdmin } = require('../../helpers/authHelper');

module.exports = (app) => {
    app.use("/v2/products", router);

    router.param("id", async (req, res, next) => {
        try {
            const product = await TableServiceInstance.findOneRow(req.params.id, 'products', 'id');
            req.product = product;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.get("/", async (req, res, next) => {
        try {
            const response = await TableServiceInstance.allRows("products");
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post("/", isAdmin, async (req, res, next) => {
        try {
            const { source, product_name, type, description, price, quantity } = req.body;
            
            const data = {
                source: source?.toLowerCase(), 
                product_name, 
                type: type?.toLowerCase(), 
                description, 
                price: parseFloat(price).toFixed(2),
                quantity: parseInt(quantity)
            }

            const product = await TableServiceInstance.newRow(data, "products");

            res.status(201).send(product);
        } catch (error) {
            next(error);
        }
    });

    router.get("/:id", async (req, res, next) => {
        try {
            res.status(200).send(req.product);
        } catch(err) {
            next(err);
        }
    });

    router.put('/:id', async (req, res, next) => {
        try {
            const product = req.product;
            for (const key in req.body) {
                if (req.body[key] === '' || req.body[key] === null || req.body[key] === undefined) {
                    delete req.body[key]
                } else {
                    if (typeof req.body[key] === "string" && key !== "description" && key !== "product_name") {
                        req.body[key] = req.body[key]?.toLowerCase();
                    } else if (key === "price") {
                        req.body[key] = parseFloat(req.body[key]).toFixed(2);
                    }
                }
            }
            req.body.modified = 'NOW()';

            const productUpdate = await TableServiceInstance.updateRow(product.id, req.body, 'products', 'id');
            res.status(201).send(productUpdate);
        } catch(err) {
            next(err);
        }
    });

    // admin
    router.delete('/:id', isAdmin, async (req, res, next) => {
        try {
            const product = req.product;
            await TableServiceInstance.removeRow(product.id, 'products', 'id');
            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    });

    router.post("/product-with-images", isAdmin, async (req, res, next) => {
        const { product, product_images } = req.body;
        const { source, product_name, type, description, price, quantity } = product;
        const productData = {
            source: source?.toLowerCase(), 
            product_name, 
            type: type?.toLowerCase(), 
            description, 
            price: parseFloat(price).toFixed(2),
            quantity: parseInt(quantity)
        }

        const theProduct = await TableServiceInstance.newRow(productData, "products");
        const newBody = product_images.map(v => ({ ...v, product_id: theProduct.id }));

        const productImages = await Promise.all(newBody.map(async (data) => await TableServiceInstance.newRow(data, "product_images")));

        const response = {
            Product: theProduct,
            Product_Images: productImages
        };
        res.status(201).send(response);
    });

    router.get("/all/products", async (req, res, next) => {
        try {
            const allProducts = await TableServiceInstance.allRows("products");
            const everything = await Promise.all(allProducts.map(async (product) => ({
                ...product, product_images: await TableServiceInstance.findAllBasedOnFkey(product.id, "product_images", "product_id")
            })));
            res.status(200).send(everything);
        } catch (error) {
            next(error);
        }
    });
};

/*
[
  { "image_name": "MONKEY", "image_data": "https://images.panda.org/assets/images/pages/welcome/orangutan_1600x1000_279157.jpg" },
  { "image_name": "FLOWER", "image_data": "https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__480.jpg" }
]
*/