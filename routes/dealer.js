const dealersRouter = require('express').Router();
const DealerService = require('../services/DealerService');
const DealerServiceInstance = new DealerService();

module.exports = (app) => {
    app.use('/dealers', dealersRouter);
    /// SUpplier bits
    dealersRouter.get('/', async (req, res) => {

        try {
            const response = await DealerServiceInstance.allDealers('dealers');

            res.status(200).send(response);
        } catch(err) {
            res.status(404).send(err)
        }
    
    })

    dealersRouter.post('/', async (req, res) => {
        try {
            const response = await DealerServiceInstance.addDealer(req.body, 'dealers')
            res.status(201).send(response);
        } catch(err) {
            res.status(500).send(err)
        }
    })

    dealersRouter.get('/:dealerId', async (req, res) => {
        try {
           const { dealerId } = req.params;
           const aDealer = await DealerServiceInstance.oneDealer(Number(dealerId), 'dealers', 'did');
           res.status(200).send(aDealer);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.put('/:dealerId', async (req, res) => {
        try {
            const id = Number(req.params.dealerId)
            const customerUpdated = await DealerServiceInstance.updateDealer(id, req.body, 'dealers', 'did');
            res.status(201).send(customerUpdated);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.delete('/:dealerId', async (req, res) => {
        try {
           const id = Number(req.params.dealerId);
           await DealerServiceInstance.removeDealer(id, 'dealers', 'did');
           res.sendStatus(204);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    ///
    ///   Suppliers -> products

    dealersRouter.param('name', async (req, res, next, name) => {
        try {
            const str = name.replace(/[a-z][^\s-_]*/gi, txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase());

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

            const obj = product.find(de => de.dpid);
            const newObject = {};
            Object.assign(newObject, obj, {['dealers_did']: obj['did'], ...obj })['did'];
            req.product = obj;

            const single = await DealerServiceInstance.singleProduct('dealer_products', req.name, req.product);

            req.single = single;
            next()
        } catch(err) {
            res.status(404).send(err);
        }
    })


    dealersRouter.get('/:name/products', async (req, res) => {
        try {
            const dealersProducts = await DealerServiceInstance.dealersProducts('dealer_products', req.name);
                        
            res.status(200).send(dealersProducts);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.post('/:name/products', async (req, res) => {
        try {
            const obj = Object.assign({}, {[Object.keys(req.name)[2]]: Object.values(req.name)[2]}, req.body)
            const response = await DealerServiceInstance.addProduct(obj, 'dealer_products')
            res.status(201).send(response);
        } catch(err) {
            res.status(500).send(err);
        }
    })

    dealersRouter.get('/:name/products/:productId', async (req, res) => {
        try {
            res.status(200).send(req.single);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.put('/:name/products/:productId', async (req, res) => {
        try {
            const obj = {}
            Object.assign(obj, req.body)
            if (obj.quantity !== undefined) {
                obj.quantity = Number(obj.quantity)
            }
            if (obj.dealers_did !== undefined) {
                obj.dealers_did = Number(obj.dealers_did)
            }
            const id = Number(req.params.productId);
            const productUpdated = await DealerServiceInstance.updateProduct(id, obj, 'dealer_products', 'dpid', req.single);
            res.status(200).send(productUpdated);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    dealersRouter.delete('/:name/products/:productId', async (req, res) => {
        try {
            await DealerServiceInstance.deleteProduct(req.single.dpid, 'dealer_products', 'dpid');
            res.sendStatus(204);
        } catch(err) {
            res.status(404).send(err)
        }
    })
}