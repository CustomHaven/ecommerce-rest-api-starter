const productRouter = require('express').Router();
const ProductService = require('../services/ProductService');
const ProductServiceInstance = new ProductService();

/* REMEMBER CHANGING PRODUCT OR MAKING A NEW PRODUCT FROM THE SUPPLIER DEALER 
SHOULD ALL BE DONE BY AN ADMIN USER!!! */

module.exports = (app) => {
    app.use('/products', productRouter);

    productRouter.get('/', async (req, res) => {
        try {
            const response = await ProductServiceInstance.allProducts('store_products');

            res.status(200).send(response);
        } catch(err) {
            res.status(404).send(err)
        }
    });

    productRouter.post('/', async (req, res) => {
        try { // important comment out remember this!!!
            /* For now I will use dealer_product_dpid hard-coded with postman later on
            I will have the dpid from the front end key change Object.key name to
            dealer_product_dpid and send that along with the rest of req.body from the frontend
            to here. */

            req.body.quantity = Number(req.body.quantity)
            req.body.dpid = Number(req.body.dpid)
            const response = await ProductServiceInstance.addProduct(req.body, 'store_products')
            res.status(201).send(response);
        } catch(err) {
            res.status(500).send(err);
        }
    });

    productRouter.get('/:productId', async (req, res) => {
        try {
           const { productId } = req.params;
           console.log(Number(productId))
           const product = await ProductServiceInstance.oneProduct(Number(productId), 'store_products', 'spid');
           res.status(200).send(product);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    productRouter.put('/:productId', async (req, res) => {
        try {
            const id = Number(req.params.productId)
            const updatedProduct = await ProductServiceInstance.updateProduct(id, req.body, 'store_products', 'spid');
            res.status(201).send(updatedProduct);
        } catch(err) {
            res.status(404).send(err)
        }
    })

    productRouter.delete('/:dealerId', async (req, res) => {
        try {
           const id = Number(req.params.dealerId);
           await ProductServiceInstance.removeProduct(id, 'store_products', 'spid');
           res.sendStatus(204);
        } catch(err) {
            res.status(404).send(err)
        }
    })
}
