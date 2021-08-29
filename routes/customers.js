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
            res.status(404).send(err)
        }
    
    })

    customersRouter.post('/', async (req, res, next) => {
        try {
            const response = await CustomerServiceInstance.makeNewCustomer(req.body, 'customers')
            res.status(201).send(response);
        } catch(err) {
            res.status(500).send(err)
        }
    })

    customersRouter.get('/:customerId', async (req, res, next) => {
        try {
           const { customerId } = req.params;
           const customer = await CustomerServiceInstance.findOneCustomer(Number(customerId), 'customers', 'cid');
           res.status(200).send(customer);
        } catch(err) {
           res.status(404).send(err)
        }
    })

    customersRouter.put('/:customerId', async (req, res, next) => {
        try {
           const id = Number(req.params.customerId)
           const customerUpdated = await CustomerServiceInstance.customerUpdate(id, req.body, 'customers', 'cid');
           res.status(201).send(customerUpdated);
        } catch(err) {
            res.status(404).send(err)
        }
    })
    
    customersRouter.delete('/:customerId', async (req, res, next) => {
        try {
           const id = Number(req.params.customerId)
           await CustomerServiceInstance.removeCustomer(id, 'customers', 'cid');

            res.status(201).send("Customer successfully deleted");
        } catch(err) {
            res.status(404).send(err)
        }
    })
}

// INSERT INTO films (name, release_year)
// VALUES ('Monsters, Inc.', 2001);