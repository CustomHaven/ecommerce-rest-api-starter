const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();

module.exports = (app) => {
    app.use("/v2/cart-list", router);

    router.param("cart_id", async (req, res, next) => {
        try {
            req.params.cart_id = req.params?.cart_id.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, "");
            const cartId = req.params.cart_id;
            if (cartId === "{cart_id}" || cartId === undefined || cartId === null || cartId === "") {
                req.cartInfo = undefined;
                next();
            } else {
                const cart = await TableServiceInstance.findOneRow(Number(cartId), 'carts', 'id');
                req.cartInfo = cart;

                const cartList = await TableServiceInstance.findAllBasedOnFkey(Number(req.cartInfo.id), "cart_list", "cart_id");
                const response = {
                    cart: req.cartInfo,
                    cart_list: cartList
                }
                req.fullCart = response;
                next();
            }
        } catch (error) {
            next(error);
        }
    });

    router.param("id", async (req, res, next) => {
        try {
            const carts = await TableServiceInstance.findOneRow(Number(req.params.id), 'cart_list', 'id');
            req.cart = carts;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.get("/", async (req, res, next) => {
        try {
            const response = await TableServiceInstance.allRows("cart_list");
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post("/cart/:cart_id", async (req, res, next) => {
        try {
            const { product_id, quantity } = req.body;
            const data = {
                product_id,
                cart_id: req.cartInfo.id,
                quantity,
            }
            const cartList = await TableServiceInstance.newRow(data, "cart_list");

            res.status(201).send(cartList);
        } catch (error) {
            next(error);
        }
    });

    router.get("/cart/:cart_id", async (req, res, next) => {
        try {
            res.status(200).send(req.fullCart);
        } catch(err) {
            next(err);
        }
    });

    router.get("/:id", async (req, res, next) => {
        try {
            res.status(200).send(req.cart);
        } catch(err) {
            next(err);
        }
    });

    router.put('/:id', async (req, res, next) => {
        try {
            const cart = req.cart;
            // only req.body I want here is quantity
            req.body.modified = "NOW()";
            const cartUpdate = await TableServiceInstance.updateRow(cart.id, req.body, 'cart_list', 'id');
            res.status(201).send(cartUpdate);
        } catch(err) {
            next(err);
        }
    });

    router.delete('/:id', async (req, res, next) => {
        try {
            await TableServiceInstance.removeRow(req.cart.id, 'cart_list', 'id');
            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    })
};