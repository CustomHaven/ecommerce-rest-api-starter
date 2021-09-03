const ordersRouter = require('express').Router();
// const OrderService = require('../services/OrderService');
// const OrderServiceInstance = new OrderService();

module.exports = app => {
    app.use('/order', ordersRouter);

    ordersRouter.get('/', (req, res) => {
        try {
            
        } catch(err) {
            throw err
        }
    });
}