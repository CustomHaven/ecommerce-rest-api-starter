const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();

module.exports = class ProductService {
    async allProducts(tableName) {
        try {
            const results = await CrudModelInstance.getAll(tableName);
            if (!results) {
                throw createError(500, 'No products found')
            }
            return results;
        } catch(err) {
            throw err;
        }
    }

    async addProduct(col, tableName) {
        try {

            const supplierProduct = await CrudModelInstance.findOne(col.dpid, 'dealer_products', 'dpid');


            const quantity = {
                quantity: supplierProduct[0].quantity - col.quantity
            };

            const column = {};
            delete Object.assign(column, {
                ['dealer_product_dpid']: col['dpid'],
                ...col,
                price: String(parseFloat(supplierProduct[0].price) * 3)
            })['dpid'];

            const product = await CrudModelInstance.newRow(column, tableName);
            if (!product) {
                throw createError(500, 'Product could not be added');
            }
            if (product) {
                await CrudModelInstance.updateRow(supplierProduct[0].dpid, quantity, 'dealer_products', 'dpid');
            }
            return product;
        } catch(err) {
            throw err;
        }
    }
}