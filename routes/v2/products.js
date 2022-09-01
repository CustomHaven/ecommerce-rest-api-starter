const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();
const { isAdmin } = require('../../helpers/authHelper');
const createError = require('http-errors');

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
            if (req.product === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const product = req.product;
                if (product.id !== req.product.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
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
                }
            }
        } catch(err) {
            next(err);
        }
    });

    // admin
    router.delete('/:id', isAdmin, async (req, res, next) => {
        try {
            if (req.product === undefined) {
                throw createError(404, 'Not logged in')
            } else {
                const product = req.product;
                if (product.id !== req.product.id) {
                    throw createError(401, 'Refresh the page should work ;)')
                } else {
                    await TableServiceInstance.removeRow(product.id, 'products', 'id');

                    res.sendStatus(204);
                }
            }
        } catch(err) {
            next(err);
        }
    })
};