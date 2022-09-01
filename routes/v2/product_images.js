const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();
const { isAdmin } = require('../../helpers/authHelper');
const createError = require('http-errors');

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

    // curl -X GET "http://localhost:4001/v2/product-images/single/3"


    router.get("/:product_id", async (req, res, next) => {
        try {
            const productImages = await TableServiceInstance.rowsBasedOnFK("product_images", "products", req.product.id, req.cols, "product_id");
            const response = {
                Product: req.product,
                Product_images: productImages
            }
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post("/:product_id", isAdmin, async (req, res, next) => {
        try {
            const { image_name, image_data } = req.body;

            const data = {
                product_id: req.product.id,
                image_name,
                image_data,
            }
            // https://www.easyjet.com/ejcms/cache/medialibrary/Images/JSS/Destinations/Hero/France_Nice_3840x2160.jpg
            const contact = await TableServiceInstance.newRow(data, "product_images");

            res.status(201).send(contact);
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
            if (req.productImage === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                res.status(200).send(req.productImage);
            }
        } catch(err) {
            next(err);
        }
    });

    router.put('/single/:id', isAdmin, async (req, res, next) => {
        try {
            if (req.productImage === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const productImage = req.productImage;
                if (productImage.id !== req.productImage.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
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
                }
            }
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