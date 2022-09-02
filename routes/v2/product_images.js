const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();
const { isAdmin } = require('../../helpers/authHelper');

module.exports = (app) => {
    app.use("/v2/product-images", router);

    router.param("id", async (req, res, next) => {
        try {
            const productImage = await TableServiceInstance.findOneRow(Number(req.params.id), 'product_images', 'id');
            req.productImage = productImage;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.param("product_id", async (req, res, next) => {
        try {

            const product = await TableServiceInstance.findOneRow(req.params.product_id, "products", "id");
            const productImages = await TableServiceInstance.findAllBasedOnFkey(product.id, "product_images", "product_id");
            req.product = product;
            req.productImages = productImages;
            next();

        } catch (error) {
            next(error);
        }
    });

    // curl -X GET "http://localhost:4001/v2/product-images/single/3"


    router.get("/:product_id", async (req, res, next) => {
        try {
            const response = {
                Product: req.product,
                Product_images: req.productImages
            }
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post("/:product_id", isAdmin, async (req, res, next) => {
        try {
            const newBody = req.body.map(v => ({ ...v, product_id: req.product.id }));
            const productImages = await Promise.all(newBody.map(async (data) => await TableServiceInstance.newRow(data, "product_images")));
            res.status(201).send(productImages);
        } catch (error) {
            next(error);
        }
    });

    router.get("/", async (req, res, next) => { // isAdmin to view all contacts
        try {
            const response = await TableServiceInstance.allRows("product_images");
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });


    // router.get("/:product_id", async (req, res, next) => {
    router.get("/single/:id", async (req, res, next) => {
        try {
            res.status(200).send(req.productImage);
        } catch(err) {
            next(err);
        }
    });

    router.put('/single/:id', isAdmin, async (req, res, next) => {
        try {
                const productImage = req.productImage;
                for (const key in req.body) {
                    if (req.body[key] === '' || req.body[key] === null || req.body[key] === undefined) {
                        delete req.body[key]
                    } else {
                        if (typeof req.body[key] === "string" && key !== "image_data") {
                            req.body[key] = req.body[key]?.toLowerCase();
                        }
                    }
                }
                req.body.modified = 'NOW()';

                const productImageUpdate = await TableServiceInstance.updateRow(productImage.id, req.body, 'product_images', 'id');
                res.status(201).send(productImageUpdate);
        } catch(err) {
            next(err);
        }
    });
// https://thumbs.dreamstime.com/b/d-mural-wallpaper-beautiful-view-landscape-background-old-arches-tree-sun-water-birds-flowers-transparent-curtains-166191190.jpg
    router.delete('/single/:id', isAdmin, async (req, res, next) => {
        try {
            await TableServiceInstance.removeRow(req.productImage.id, 'product_images', 'id');
            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    })
};