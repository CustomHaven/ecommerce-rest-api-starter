// const authRouter = require('./auth');
// const cartRouter = require('./cart');
// const orderRouter = require('./order');
// const userRouter = require('./user');
const dealersRouter = require('./dealer');
const customersRouter = require('./customers');
const productRouter = require('./product');


module.exports = app => {
    dealersRouter(app);
    customersRouter(app);
    productRouter(app);
}
