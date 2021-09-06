const ordersRouter = require('express').Router();
const OrderService = require('../services/OrderService');
const OrderServiceInstance = new OrderService();

module.exports = app => {
    app.use('/orders', ordersRouter);

    ordersRouter.get('/', async (req, res) => {
        try {
            const orders = await OrderServiceInstance.allOrders('orders');
            res.status(200).send(orders);
        } catch(err) {
            res.status(404).send(err);
        }
    });

    ordersRouter.post('/', async (req, res) => {
        try {
            // console.log(req.body)
            const order = await OrderServiceInstance.newOrder(req.body, 'orders')
            res.status(201).send(order)
        } catch(err) {
            res.status(404).send(err);
        }
    });
}