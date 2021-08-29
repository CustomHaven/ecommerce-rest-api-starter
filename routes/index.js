// const authRouter = require('./auth');
// const cartRouter = require('./cart');
// const orderRouter = require('./order');
// const productRouter = require('./product');
// const userRouter = require('./user');
const dealersRouter = require('./dealer');
const customersRouter = require('./customers');

module.exports = app => {
    dealersRouter(app);
    customersRouter(app);
}
