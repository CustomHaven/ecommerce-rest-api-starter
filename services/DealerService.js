const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();
const logger = require('../logger');

module.exports = class DealerService {

    async allDealers(tableName) {
        try {
            logger.info('alldealers')
            const results = await CrudModelInstance.getAll(tableName);
            return results;
        } catch(err) {
            throw err;
        }
    }

    async addDealer(col, tableName) {
        try {
            const dealer = await CrudModelInstance.newRow(col, tableName);
            if (!dealer) {
                throw createError(500, 'Supplier could not be added')
            }
            return dealer;
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
                throw createError(404, 'Supplier does not have the requested product');
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
                throw createError(404, 'Supplier has no products');
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

    async addProduct(col, tableName) {
        try {
            const newProduct = await CrudModelInstance.newRow(col, tableName);
            if (!newProduct) {
                throw createError(404, 'Could not make the new product');
            }
            return newProduct;
        } catch(err) {
            throw err;
        }
    }

    async updateProduct(id, col, tableName, idName, fKeyObj) {
        try {
            
            if (fKeyObj.dpid !== id) {
                return null;
            }
        
            const customer = await CrudModelInstance.updateRow(id, col, tableName, idName);

            if (!customer) {
                throw createError(404, 'Customer not found so we cannot update what is not found in the Database');
            }

            return customer;
            
        } catch(err) {
            throw err;
        }
    }

    async deleteProduct(id, tableName, idName) {
        try {
            const deleting = CrudModelInstance.deleteRow(id, tableName, idName);
            if (!deleting) {
                throw createError(500, 'No product in record')
            }
            return deleting;
                        
        } catch(err) {
            throw err;
        }
    }
}