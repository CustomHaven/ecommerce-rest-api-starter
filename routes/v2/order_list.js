const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();
const { isAdmin, authenticationMiddleware } = require('../../helpers/authHelper');

module.exports = (app) => {
    app.use("/v2/order-list", router);

    router.param("order_id", async (req, res, next) => {
        try {
            req.params.order_id = req.params?.order_id.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, "");
            const orderId = req.params.order_id;

            if (orderId === "{order_id}" || orderId === undefined || orderId === null || orderId === "") {
                req.orderInfo = undefined;
                next();
            } else {
                const order = await TableServiceInstance.findOneRow(orderId, 'orders', 'id');
                req.orderInfo = order;
                next();
            }
        } catch (error) {
            next(error);
        }
    });

    router.param("id", async (req, res, next) => {
        try {
            const orderList = await TableServiceInstance.findOneRow(Number(req.params.id), 'order_list', 'id');
            req.orderList = orderList;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.get("/", isAdmin, async (req, res, next) => {
        try {
            const response = await TableServiceInstance.allRows("order_list");
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post("/order/:order_id", authenticationMiddleware, async (req, res, next) => {
        try {
            // const { product_id, quantity, price } = req.body;
            if (!Array.isArray(req.body)) {
                req.body = [req.body];
            }
            // from the client they fill in the req.body simple!!
            // prod 3 0.20, 6 = 1.2 and prod 8 0.99, 3 = 2.97 total = 4.17 
            // just an example but the price and total quantity along with the 2 id's comes from the client
            const data = [];
            for (const item of req.body) {
                const obj = {
                    product_id: item.product_id,
                    order_id: req.orderInfo.id,
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price).toFixed(2)
                };
                data.push(obj);
            }

            const mappedData = await Promise.all(data.map(async (item) => {
                return await TableServiceInstance.newRow(item, "order_list");
            }))
            
            res.status(201).send(mappedData);
        } catch (error) {
            next(error);
        }
    });

    router.get("/:id", authenticationMiddleware, async (req, res, next) => {
        try {
            res.status(200).send(req.orderList);
        } catch(err) {
            next(err);
        }
    });


    // NOT DOCUMENTED FEELING STILL HALF HALF IF I SHOULD HAVE THIS!
    // The two below routes can almost never happened unless in extreme circumstances
    // remove unless before an item goes off to delievery and a customer changes their mind
    router.put('/:id', async (req, res, next) => {
        try {
            const order = req.orderList;
            // only req.body I want here is quantity
            if (req.body.price) {
                req.body.price = parseFloat(req.body.price).toFixed(2);
            }
            if (req.body.quantity) {
                req.body.quantity = parseInt(req.body.quantity);
            }

            req.body.modified = "NOW()";
            const orderUpdate = await TableServiceInstance.updateRow(order.id, req.body, 'order_list', 'id');
            res.status(201).send(orderUpdate);
        } catch(err) {
            next(err);
        }
    });

    // NOT DOCUMENTED FEELING STILL HALF HALF IF I SHOULD HAVE THIS!
    // Incase a customer changes their mind and we can then delete the item from the order_list record
    router.delete('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            await TableServiceInstance.removeRow(req.orderList.id, 'order_list', 'id');
            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    })
};