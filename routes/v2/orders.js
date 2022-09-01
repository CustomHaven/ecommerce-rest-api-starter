const router = require('express').Router();
const TableService = require('../../services/TableService');
const TableServiceInstance = new TableService();
const { isAdmin, limitIDAccess, authenticationMiddleware } = require('../../helpers/authHelper');

module.exports = (app) => {
    app.use("/v2/orders", router);

    router.param("user_id", async (req, res, next) => {
        try {
            req.params.user_id = req.params?.user_id.replace(/[-¬~`!£@|#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, "");
            const userId = req.params.user_id;
            if (userId === "{user_id}" || userId === undefined || userId === null || userId === "") {
                req.userInfo = undefined;
                next();
            } else {
                const user = await TableServiceInstance.findOneRow(userId, 'users', 'id');
                limitIDAccess(user, req.user);
                req.userInfo = user;
                next();
            }
        } catch (error) {
            next(error);
        }
    });

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
            const order = await TableServiceInstance.findOneRow(req.params.id, 'orders', 'id');
            req.order = order;
            next();
        } catch (error) {
            next(error);
        }
    });

    router.get("/", isAdmin, async (req, res, next) => {
        try {
            const response = await TableServiceInstance.allRows("orders");
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post("/", authenticationMiddleware, async (req, res, next) => {
        try {
            const { user_id, cart_id, final_price, total_items } = req.body;

            // prod 3 0.20, 6 = 1.2 and prod 8 0.99, 3 = 2.97 total = 4.17 
            // just an example but the price and total quantity along with the 2 id's comes from the client
            const data = {
                user_id,
                cart_id,
                shipping_status: "pending",
                final_price: parseFloat(final_price).toFixed(2),
                total_items: parseInt(total_items),
                tracking_id: "not available"
            }

            const response = await TableServiceInstance.newRow(data, "orders");

            res.status(201).send(response);
        } catch (error) {
            next(error);
        }
    });

    // instead of the previous post route in this below route the server does all the heavy lifting and fills two tables in
    router.post("/:user_id/:cart_id", authenticationMiddleware, async (req, res, next) => {
        try {
            const value = Number(req.fullCart.cart_list[0].cart_id);

            const priceQuantity = await TableServiceInstance.findTotalPriceAndUnits("products", "cart_list", "id", "product_id", "cart_id", value, "price", "quantity");

            const data = {
                user_id: req.userInfo.id,
                cart_id: parseInt(req.fullCart.cart.id),
                shipping_status: "pending", // Maybe we send in from the req.body just these two
                final_price: parseFloat(priceQuantity.final_price).toFixed(2),
                total_items: parseInt(priceQuantity.total_items),
                tracking_id: "not available" // Maybe we send in from the req.body just these two
            };

            const newOrder = await TableServiceInstance.newRow(data, "orders");

            const priceRows = await TableServiceInstance.findPrice("products", "cart_list", "id", "product_id", "cart_id", value, "price", "quantity");

            const orderListMap = await Promise.all(req.fullCart.cart_list.map(async (cart, index) => {
                const orderData = {
                    product_id: cart.product_id,
                    // order_id: orderId,
                    order_id: newOrder.id,
                    quantity: parseInt(cart.quantity),
                    price: parseFloat(priceRows[index].price).toFixed(2)
                }
                return await TableServiceInstance.newRow(orderData, "order_list");
            }));

            const response = {
                Order: newOrder,
                Order_List: orderListMap
            };

            res.status(201).send(response);

        } catch (error) {
            next(error);
        }
    });

    router.get("/:id", authenticationMiddleware, async (req, res, next) => {
        try {
            const orderList = await TableServiceInstance.findAllBasedOnFkey(req.order.id, "order_list", "order_id");
            const response = {
                Order: req.order,
                Order_List: orderList
            };
            res.status(200).send(response);
        } catch(err) {
            next(err);
        }
    });

    router.put('/:id', authenticationMiddleware, async (req, res, next) => {
        try {
            const order = req.order;
            
            for (const key in req.body) {
                if (req.body[key] === '' || req.body[key] === undefined) {
                    delete req.body[key]
                } else {
                    req.body[key]?.toLowerCase();
                }
            }
            req.body.modified = "NOW()";

            const orderUpdate = await TableServiceInstance.updateRow(order.id, req.body, 'orders', 'id');
            res.status(201).send(orderUpdate);
        } catch(err) {
            next(err);
        }
    });

    // DO NOT WANT A DELETE ROUTE!
    // router.delete('/:id', async (req, res, next) => {
    //     try {
    //         await TableServiceInstance.removeRow(req.carts.id, 'carts', 'id');
    //         res.sendStatus(204);
    //     } catch(err) {
    //         next(err);
    //     }
    // })
};