// DEPRECATED ROUTES

const orderListRouter = require('express').Router();
const OLService = require('../services/OLService');
const OLServiceInstance = new OLService();

// change this to super admins instead!
module.exports = (app) => {
    app.use('/orderlist', orderListRouter);

    // WE NEED 1 GET AND 1 POST AND A DELETE TO DELETE BASED ON THE DATE SO MULTIPLE COLUMNS WILL GET DELETED!

    orderListRouter.get('/', async (req, res, next) => {
        try {
            const orderList = await OLServiceInstance.wholeList('order_list');
            res.status(200).send(orderList);
        } catch(err) {
            next(err);
        }
    });

    orderListRouter.post('/', async (req, res, next) => {
        try {
            const orderList = await OLServiceInstance.generateNewList(req.body, 'order_list');
            res.status(201).send(orderList);
        } catch(err) {
            next(err);
        }
    });

    orderListRouter.delete('/:date', async (req, res, next) => {
      try {
        await OLServiceInstance.deleteList(req.params.date, 'order_list', 'order_date');
        res.sendStatus(204);
      } catch(err) {
          next(err);
      }
    });

    orderListRouter.get('/:customerId/:date', async (req, res, next) => {
      try {
        const objHolder = {
          id: Number(req.params.customerId),
          date: req.params.date
        }

        const result = await OLServiceInstance.getCustomerDate(objHolder, 'order_list', 'customers_cid', 'order_date');
        res.status(200).send(result);
      } catch(err) {
          next(err);
      }
    });

}