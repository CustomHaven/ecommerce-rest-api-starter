// // DEPRECATED ROUTES

const dealersRouter = require('express').Router();
const { isAdmin } = require('../../helpers/authHelper');
const logger = require('../../logger');
const DealerService = require('../../services/DealerService');
const DealerServiceInstance = new DealerService();

module.exports = (app) => {
    app.use('/dealers', dealersRouter);
    /// SUpplier bits
    dealersRouter.get('/', async (req, res, next) => {

        try {
            logger.info('info dealer')
            logger.error('error on dealer')
            const response = await DealerServiceInstance.allDealers('dealers');
            res.status(200).send(response);
        } catch(err) {
            next(err)
        }
    
    })

    dealersRouter.post('/', isAdmin, async (req, res, next) => {
        try {
            const response = await DealerServiceInstance.addDealer(req.body, 'dealers')
            res.status(201).send(response);
        } catch(err) {
            next(err);
        }
    })

    dealersRouter.get('/:dealerId', isAdmin, async (req, res, next) => {
        try {
           const { dealerId } = req.params;
           const aDealer = await DealerServiceInstance.oneDealer(Number(dealerId), 'dealers', 'did');
           res.status(200).send(aDealer);
        } catch(err) {
            next(err)
        }
    })

    dealersRouter.put('/:dealerId', isAdmin, async (req, res, next) => {
        try {
            const id = Number(req.params.dealerId)
            const customerUpdated = await DealerServiceInstance.updateDealer(id, req.body, 'dealers', 'did');
            res.status(201).send(customerUpdated);
        } catch(err) {
            next(err)
        }
    })

    dealersRouter.delete('/:dealerId', isAdmin, async (req, res, next) => {
        try {
           const id = Number(req.params.dealerId);
           await DealerServiceInstance.removeDealer(id, 'dealers', 'did');
           res.sendStatus(204);
        } catch(err) {
            next(err)
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
            next(err)
        }
    })

    dealersRouter.param('productId', async (req, res, next, productId) => {
        try {
            const product = await DealerServiceInstance.oneDealer(Number(productId), 'dealer_products', 'dpid');
            const obj = product.find(de => de.dpid);
            const newObject = {};
            Object.assign(newObject, obj, {['dealers_did']: obj['did'], ...obj })['did'];
            req.product = obj;
            const single = await DealerServiceInstance.singleProduct('dealer_products', req.name, req.product);
            req.single = single;
            next()
        } catch(err) {
            next(err);
        }
    })


    dealersRouter.get('/:name/products', isAdmin, async (req, res, next) => {
        try {
            console.log(req.name)
            const dealersProducts = await DealerServiceInstance.dealersProducts('dealer_products', req.name);                        
            res.status(200).send(dealersProducts);
        } catch(err) {
            next(err)
        }
    })

    dealersRouter.post('/:name/products', isAdmin, async (req, res, next) => {
        try {
            const obj = Object.assign({}, {[Object.keys(req.name)[2]]: Object.values(req.name)[2]}, req.body)
            const response = await DealerServiceInstance.addProduct(obj, 'dealer_products')
            res.status(201).send(response);
        } catch(err) {
            next(err);
        }
    })

    dealersRouter.get('/:name/products/:productId', isAdmin, async (req, res, next) => {
        try {
            res.status(200).send(req.single);
        } catch(err) {
            next(err);
        }
    })

    dealersRouter.put('/:name/products/:productId', isAdmin, async (req, res, next) => {
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
            next(err);
        }
    })

    dealersRouter.delete('/:name/products/:productId', isAdmin, async (req, res, next) => {
        try {
            await DealerServiceInstance.deleteProduct(req.single.dpid, 'dealer_products', 'dpid');
            res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    })
}