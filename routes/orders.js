const ordersRouter = require('express').Router();
const OrderService = require('../services/OrderService');
const OrderServiceInstance = new OrderService();
const EmailService = require('../services/EmailService');
const EmailServiceInstance = new EmailService();

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
    
    ordersRouter.get('/email', async (req, res) => {
        try { 
            // To is best to loop list of email names if i want to send the same email to loads of ppl
            // without them seeing other people's email
            console.log('email req')
            const message = {
                to: '"Person" <person@example.com>',         // List of recipients
                subject: 'Design Your Model S | Tesla', // Subject line
                html: '<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>', // Plain text body
                attachments: [
                  { // Use a URL as an attachment
                    filename: 'your-testla.png',
                    path: 'https://media.gettyimages.com/photos/view-of-tesla-model-s-in-barcelona-spain-on-september-10-2018-picture-id1032050330?s=2048x2048'
                  }
                ]
            }
            const email = await EmailServiceInstance.sendMessage(message);
            console.log(email)
            res.status(201).send("Email was sent!")
        } catch(err) {
            res.status(404).send(err);
        }
    });
}