// const authRouter = require('./auth');
// const cartRouter = require('./cart');
const dealersRouter = require('./dealer');
const usersRouter = require('./users');
const customersRouter = require('./customers');
const productRouter = require('./product');
const ordersRouter = require('./orders');
const orderListRouter = require('./order_list');
const authRouter = require('./auth');


module.exports = (app, passport) => {
    dealersRouter(app);
    usersRouter(app);
    customersRouter(app);
    productRouter(app);
    ordersRouter(app);
    orderListRouter(app);
    authRouter(app, passport);
}
