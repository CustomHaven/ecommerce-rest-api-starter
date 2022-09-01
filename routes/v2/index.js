const authRouter = require('./auth');
const usersRouter = require('./users');
const contactRouter = require("./contact_detail");
const productRouter = require('./products');
const productImageRouter = require("./product_images");
const cartRouter = require('./cart');
const cartListRouter = require("./cart_list");
const ordersRouter = require('./orders');
const orderListRouter = require('./order_list');
const paymentRouter = require("./payment");

module.exports = (app, passport) => {
    authRouter(app, passport);
    usersRouter(app);
    contactRouter(app);
    productRouter(app);
    productImageRouter(app);
    cartRouter(app);
    cartListRouter(app);
    ordersRouter(app);
    orderListRouter(app);
    paymentRouter(app);
}