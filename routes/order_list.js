const orderListRouter = require('express').Router();
const OLService = require('../services/OLService');
const OLServiceInstance = new OLService();

// change this to super admins instead!
module.exports = (app) => {
    app.use('/orderlist', orderListRouter);

    // WE NEED 1 GET AND 1 POST AND A DELETE TO DELETE BASED ON THE DATE SO MULTIPLE COLUMNS WILL GET DELETED!

    orderListRouter.get('/', async (req, res) => {
        try {
            const orderList = await OLServiceInstance.wholeList('order_list');
            res.status(200).send(orderList);
        } catch(err) {
            res.status(404).send(err)
        }
    });

    orderListRouter.post('/', async (req, res) => {
        try {

            const arrayObject = [
                {
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
            ]

            const orderList = await OLServiceInstance.generateNewList(arrayObject, 'order_list');
            res.status(200).send(orderList);
        } catch(err) {
            res.status(404).send(err)
        }
    });
}

/*
    const ordered_items = `
        CREATE TABLE IF NOT EXISTS ordered_items (
            customers_cid integer REFERENCES customers (cid),
            store_products_spid integer REFERENCES store_products (spid),
            PRIMARY KEY (customers_cid, store_products_spid),
            quantity integer,
            order_date date
        );
    `
*/

/* DO THIS WHEN THE FRONT END IS READY!!! OR DO IT NOW
Plan hmmm save the cart items in an array of objects then 
we send them to a special CrudModel where it loops over the content
of the array of object and does the create a newRow for every ordered_items
*/