const createError = require('http-errors');
// const DealerModel = require('../models/DealerModel');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();

module.exports = class DealerService {

    async addDealer(col, tableName) {
        try {
            // console.log(col)
            // console.log(tableName)
            const dealer = await CrudModelInstance.newRow(col, tableName);
            console.log(dealer)
            if (!dealer) {
                throw createError(500, 'Supplier could not be added')
            }
            return dealer;
        } catch(err) {
            throw err;
        }
    }

    async allDealers(tableName) {
        try {

            const results = await CrudModelInstance.getAll(tableName);

            return results;

        } catch(err) {
            throw err;
        }
    }

    async getName(str, tableName, colName) {
        try {
            const name = await CrudModelInstance.fetchName(str, tableName, colName);

            if (!name) {
                throw createError(404, 'Name not found');
            }

            return name;
            
        } catch(err) {
            throw err;
        }
    }

    async oneDealer(id, tableName, idName) {
        try {
            const dealer = await CrudModelInstance.findOne(id, tableName, idName);
            if (!dealer) {
                throw createError(404, 'Supplier not found'); // why is this throw error coming up for deleteRow
            }

            return dealer;
            
        } catch(err) {
            throw err;
        }
    }

    async updateDealer(id, col, tableName, idName) {
        try {
            const customer = await CrudModelInstance.updateRow(id, col, tableName, idName);

            if (!customer) {
                throw createError(404, 'Supplier was not found');
            }

            return customer;
            
        } catch(err) {
            throw err;
        }
    }

    async removeDealer(id, tableName, idName) {
        try {

            const deleteDealer = await CrudModelInstance.deleteRow(id, tableName, idName);

            if (deleteDealer === null) {
                throw createError(404, 'No Supplier with that ID');
            }
            return deleteDealer;

        } catch(err) {
            throw err;
        }
        
    }

    async dealersProducts(tableName, fKeyObj) {
        try {

            const results = await CrudModelInstance.getAll(tableName);
            const dealersProducts = results.filter(deal => deal.dealers_did === fKeyObj?.dealers_did);
            
            if (dealersProducts.length === 0) {
                throw createError(404, 'Dealer/Supplier not found');
            }
            
            return dealersProducts;
                        
        } catch(err) {
            throw err;
        }
    }

    async singleProduct(tableName, fKeyObj, product) {
        try {

            const results = await CrudModelInstance.getAll(tableName);
            const dealersProducts = results.filter(deal => deal.dealers_did === fKeyObj?.dealers_did);

            const single = dealersProducts.find(pro => (pro.dpid === product.dpid) && (pro.dealers_did === fKeyObj.dealers_did))
            
            if (single === undefined) {
                throw createError(404, 'Product not found');
            }
            
            return single;
                        
        } catch(err) {
            throw err;
        }
    }

    async deleteProduct(tableName, fKeyObj, product) {
        try {

            const results = await CrudModelInstance.getAll(tableName);
            const dealersProducts = results.filter(deal => deal.dealers_did === fKeyObj?.dealers_did);

            const single = dealersProducts.find(pro => (pro.dpid === product.dpid) && (pro.dealers_did === fKeyObj.dealers_did))
            
            if (single === undefined) {
                throw createError(404, 'No such product in record');
            }
            
            const deleting = CrudModelInstance.deleteRow(single.dpid, 'dealer_products', 'dpid');

            return deleting;
                        
        } catch(err) {
            throw err;
        }
    }
}