const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();

module.exports = (app) => {
    app.use("/v2/carts", router);

    /* test the query param on the frontend if it does not work we can use this param's instead
    router.param("user_id", async (req, res, next) => {
        try {
            req.params.user_id = req.params?.user_id.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, "");
            const userId = req.params.user_id;
            if (userId === "{user_id}" || userId === undefined || userId === null || userId === "") {
                req.userInfo = undefined;
                next();
            } else {
                const user = await TableServiceInstance.findOneRow(userId, 'users', 'id');
                req.userInfo = user;
                next();
            }
        } catch (error) {
            next(error);
        }
    });
    */

    router.param("id", async (req, res, next) => {
        try {
            const carts = await TableServiceInstance.findOneRow(req.params.id, 'carts', 'id');
            req.carts = carts;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.get("/", async (req, res, next) => {
        try {
            const response = await TableServiceInstance.allRows("carts");
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post("/cart/user_id", async (req, res, next) => {
        try {
            let user;
            if ("user_id" in req.query) {
                req.query.user_id = req.query?.user_id.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, "");
                const userId = req.query.user_id;
                user = await TableServiceInstance.findOneRow(userId, 'users', 'id');
            }

            const data = {
                user_id: user !== undefined ? user.id : null,
                abandonded: true,
            }

            const cart = await TableServiceInstance.newRow(data, "carts");
            res.status(201).send(cart);
        } catch (error) {
            next(error);
        }
    });

    router.get("/:id", async (req, res, next) => {
        try {
            res.status(200).send(req.carts);
        } catch(err) {
            next(err);
        }
    });

    router.put('/:id', async (req, res, next) => {
        try {
            const cart = req.carts;
            
            // for (const key in req.body) {
            //     if (req.body[key] === '' || req.body[key] === undefined) {
            //         delete req.body[key]
            //     }
            // }
            req.body.modified = "NOW()";


            const cartUpdate = await TableServiceInstance.updateRow(cart.id, req.body, 'carts', 'id');
            res.status(201).send(cartUpdate);

        } catch(err) {
            next(err);
        }
    });

    router.delete('/:id', async (req, res, next) => {
        try {
            await TableServiceInstance.removeRow(req.carts.id, 'carts', 'id');
            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    })
};