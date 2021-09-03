// const authRouter = require('./auth');
// const cartRouter = require('./cart');
const dealersRouter = require('./dealer');
const usersRouter = require('./users');
const customersRouter = require('./customers');
const productRouter = require('./product');
const ordersRouter = require('./orders');
const orderListRouter = require('./order_list');


module.exports = app => {
    dealersRouter(app);
    usersRouter(app);
    customersRouter(app);
    productRouter(app);
    ordersRouter(app);
    orderListRouter(app);
}
