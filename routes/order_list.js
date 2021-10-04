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
            console.log(req.body) // We have the array of object looks exactly like below!!
            /*const arrayObject = [
                {// might need a 4 key for price from the ui client
                    customers_cid: 3,
                    store_products_spid: 6,
                    quantity: 3
                },
                {
                    customers_cid: 3,
                    store_products_spid: 5,
                    quantity: 1
                },
                {
                    customers_cid: 3,
                    store_products_spid: 4,
                    quantity: 2
                }
            ]*/
            const orderList = await OLServiceInstance.generateNewList(req.body, 'order_list');
            res.status(201).send(orderList);
        } catch(err) {
            next(err);
        }
    });

    orderListRouter.delete('/:date', async (req, res, next) => {
      try {
        await OLServiceInstance.deleteList(req.params.date, 'order_list', 'order_date');
        res.sendStatus(204)
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



// const arrayObject = [
//     {
//         customers_cid: 3,
//         store_products_spid: 6,
//         quantity: 3,
//         order_date: '2021-09-03 20:22:33',
//         spid: this.store_products_spid,
//     },
//     {
//         customers_cid: 3,
//         store_products_spid: 5,
//         quantity: 3,
//         order_date: '2021-09-03 20:22:33',
//         spid: this.store_products_spid,
//     },
//     {
//         customers_cid: 3,
//         store_products_spid: 4,
//         quantity: 2,
//         order_date: '2021-09-03 20:22:33',
//         spid: this.store_products_spid,
//     }
// ]