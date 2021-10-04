const customersRouter = require('express').Router();

const CustomerService = require('../services/CustomerService');
const CustomerServiceInstance = new CustomerService();


module.exports = (app) => {
    app.use('/customers', customersRouter);

    customersRouter.get('/', async (req, res, next) => {
        try {
            const response = await CustomerServiceInstance.allCustomers('customers');

            res.status(200).send(response);
        } catch(err) {
            next(err);
        }
    
    })

    customersRouter.post('/', async (req, res, next) => {
        try {
            console.log("welcome!")
            const response = await CustomerServiceInstance.makeNewCustomer(req.body, 'customers')
            res.status(201).send(response);
        } catch(err) {
            next(err);
        }
    })

    customersRouter.get('/:customerId', async (req, res, next) => {
        try {
           const { customerId } = req.params;
           const customer = await CustomerServiceInstance.findOneCustomer(Number(customerId), 'customers', 'cid');
           res.status(200).send(customer);
        } catch(err) {
           next(err);
        }
    })

    customersRouter.put('/:customerId', async (req, res, next) => {
        try {
           const id = Number(req.params.customerId)
           const customerUpdated = await CustomerServiceInstance.customerUpdate(id, req.body, 'customers', 'cid');
           res.status(201).send(customerUpdated);
        } catch(err) {
            next(err);
        }
    })
    
    customersRouter.delete('/:customerId', async (req, res, next) => {
        try {
           const id = Number(req.params.customerId)
           await CustomerServiceInstance.removeCustomer(id, 'customers', 'cid');

            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    })
};