// DEPRECATED ROUTES

const ordersRouter = require('express').Router();
const path = require('path');
const ejs = require('ejs');
const OrderService = require('../services/OrderService');
const OrderServiceInstance = new OrderService();
const EmailService = require('../services/EmailService');
const EmailServiceInstance = new EmailService();


module.exports = app => {

    app.use('/orders', ordersRouter);

    ordersRouter.get('/', async (req, res, next) => {
        try {
            const orders = await OrderServiceInstance.allOrders('orders');
            res.status(200).send(orders);
        } catch(err) {
            next(err);
        }
    });

    ordersRouter.post('/', async (req, res, next) => {
        try {
            // console.log(req.body)
            const order = await OrderServiceInstance.newOrder(req.body, 'orders');
            res.status(201).send(order);
        } catch(err) {
            next(err);
        }
    });

    ordersRouter.param('orderId', async (req, res, next, orderId) => {
                // To is best to loop list of email names if i want to send the same email to loads of ppl
        // without them seeing other people's email
        // person will be returned as an object to make it easier for ourself to work with what we have below
        const person = await OrderServiceInstance.findAnOrder(Number(orderId), 'orders', 'oid');
        req.order = person.order;
        req.person = person.customer;
        req.orderList = person.orderList;
        next();
    })
    
    ordersRouter.get('/email/:orderId', async (req, res, next) => {
        try { 
            const pathString = path.join(__dirname, '../views/email.ejs');
            ejs.renderFile(pathString, { order: req.order, orderList: req.orderList, person: req.person }, async (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    const message = {
                        to: `"${req.person?.first_name + ' ' + req.person?.last_name}" <${req.person?.email}>`,
                        subject: 'Design Your Model S | Tesla',
                        html: data,
                        attachments: [
                          {
                            filename: 'your-testla.png',
                            path: 'https://media.gettyimages.com/photos/view-of-tesla-model-s-in-barcelona-spain-on-september-10-2018-picture-id1032050330?s=2048x2048'
                          }
                        ]
                    };
                    // console.log("html data ======================>", message.html);
                    await EmailServiceInstance.sendMessage(message);
                }
            });
            res.status(201).send("Email was sent!");
        } catch(err) {
            next(err);
        }
    });
};