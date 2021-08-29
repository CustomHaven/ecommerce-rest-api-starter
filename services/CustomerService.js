const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();

module.exports = class CustomerService {

    async allCustomers(tableName) {
        try {

            const allCustomers = await CrudModelInstance.getAll(tableName);

            if (!allCustomers) {
                throw createError(404, 'Wrong path');
            }

            return allCustomers;

        } catch(err) {
            throw err;
        }
    }

    async findOneCustomer(id, tableName, idName) {
        try {
            const customer = await CrudModelInstance.findOne(id, tableName, idName);

            if (!customer) {
                throw createError(404, 'Customer not found');
            }

            return customer;
            
        } catch(err) {
            throw err;
        }
    }
    async makeNewCustomer(col, tableName) {
        try {
            const customer = await CrudModelInstance.newRow(col, tableName);

            if (!customer) {
                throw createError(500, 'Could not make a new customer')
            }
            return customer;
        } catch(err) {
            throw err;
        }
    }
    async customerUpdate(id, col, tableName, idName) {
        try {
            const customer = await CrudModelInstance.updateRow(id, col, tableName, idName);

            if (!customer) {
                throw createError(404, 'Customer not found so we cannot update what is not found in the Database');
            }

            return customer;
            
        } catch(err) {
            throw err;
        }
    }

    async removeCustomer(id, tableName, idName) {
        try {

            const customerRemoved = await CrudModelInstance.deleteRow(id, tableName, idName);

            if (customerRemoved === null) {
                throw createError(404, 'Invalid ID no customer found');
            }
            return customerRemoved;

        } catch(err) {
            throw err;
        }
    }
}