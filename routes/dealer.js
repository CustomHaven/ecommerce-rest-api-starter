const dealersRouter = require('express').Router();
// const createError = require('http-errors');
const DealerService = require('../services/DealerService');
const DealerServiceInstance = new DealerService();

module.exports = (app) => {
    app.use('/dealers', dealersRouter);

    dealersRouter.get('/', async (req, res, next) => {

        try {
            const response = await DealerServiceInstance.allDealers('dealers');

            res.status(200).send(response);
        } catch(err) {
            res.status(404).send(err)
        }
    
    })

    dealersRouter.post('/', async (req, res, next) => {
        try {
            const response = await DealerServiceInstance.addDealer(req.body, 'dealers')
            res.status(201).send(response);
        } catch(err) {
            res.status(500).send(err)
        }
    })

    dealersRouter.get('/:dealerId', async (req, res, next) => {
        try {
           const { dealerId } = req.params;
           const aDealer = await DealerServiceInstance.oneDealer(Number(dealerId), 'dealers', 'did');
           res.status(200).send(aDealer);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.put('/:dealerId', async (req, res, next) => {
        try {
            const id = Number(req.params.dealerId)
            const customerUpdated = await DealerServiceInstance.updateDealer(id, req.body, 'dealers', 'did');
            res.status(201).send(customerUpdated);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.delete('/:dealerId', async (req, res, next) => {
        try {
           const { dealerId } = req.params;
           await DealerServiceInstance.removeDealer(Number(dealerId), 'dealers', 'did');
           res.sendStatus(204);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    ///
    ///   dealers/products

    dealersRouter.param('name', async (req, res, next, name) => {
        try {
            const str = name.replace(/[a-z][^\s-_]*/gi, txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase());
            console.log(str)
            const theName = await DealerServiceInstance.getName(str, 'dealers', 'name')

            const obj = {};
            delete Object.assign(obj, theName, {['dealers_did']: theName['did'], ...theName })['did'];
            req.name = obj;
            next();
        } catch(err) {
            res.status(404).send(err);
        }
    })

    dealersRouter.param('productId', async (req, res, next, productId) => {
        try {
            const product = await DealerServiceInstance.oneDealer(Number(productId), 'dealer_products', 'dpid')
            // console.log(product)
            console.log(product)
            const obj = product.find(de => de.dpid);
            const newObject = {};
            Object.assign(newObject, obj, {['dealers_did']: obj['did'], ...obj })['did'];
            req.product = obj;

            next()
        } catch(err) {
            res.status(404).send(err); // this was my problem!!!!!
        }
    })

    // dealersRouter.get('/:dealerId/products', async (req, res, next) => {
    //     try {
    //         const dealersProducts = await DealerServiceInstance.dealersProducts('dealer_products', req.dealer);
                        
    //         res.status(200).send(dealersProducts);
    //     } catch(err) {
    //         res.status(404).send(err)
    //     }
    // })

    dealersRouter.get('/:name/products', async (req, res, next) => {
        try {
            const dealersProducts = await DealerServiceInstance.dealersProducts('dealer_products', req.name);
                        
            res.status(200).send(dealersProducts);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.post('/:name/products', async (req, res, next) => {
        try {
            const response = await DealerServiceInstance.makeNewCustomer(req.body, 'dealer_products')
            res.status(201).send(response);
        } catch(err) {
            res.status(500).send(err)
        }
    })

    dealersRouter.get('/:name/products/:productId', async (req, res, next) => {
        try {
            console.log(req.product)
            console.log(req.params.productId)
            const single = await DealerServiceInstance.singleProduct('dealer_products', req.name, req.product);
            res.status(200).send(single);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.delete('/:name/products/:productId', async (req, res, next) => {
        try {
            await DealerServiceInstance.deleteProduct('dealer_products', req.name, req.product);
            res.status(200).send("Product successfully deleted");
        } catch(err) {
            res.status(404).send(err)
        }
    })

}
