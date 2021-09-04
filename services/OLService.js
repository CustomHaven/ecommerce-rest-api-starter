const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();
const moment = require('moment');

module.exports = class OLService {
    constructor() {
        this._date = 'NOW()';
    }

    static upper(date) {
        const copy = date;
        const upper = moment(copy, 'YYYY-MM-DD HH:mm:ss')
                        .add(3, 'minutes');
        
        const upperBound = upper.toISOString(true).replace(/\.\d+\+\d+\:\d+/, '').replace(/T/, ' ');

        return upperBound;
    }

    static lower(date) {
        const copy = date;
        const lower = moment(copy, 'YYYY-MM-DD HH:mm:ss')
                        .subtract(3, 'minutes');

        const lowerBound = lower.toISOString(true).replace(/\.\d+\+\d+\:\d+/, '').replace(/T/, ' ');

        return lowerBound;
    }
    
    async wholeList(tableName) {
        try {
            const orderList = await CrudModelInstance.getAll(tableName);

            if (!orderList) {
                throw createError(404, 'Invalid path');
            }

            return orderList;

        } catch(err) {
            throw err;
        }
    }

    async generateNewList(arrayObject, tableName) {
        try {
            const columns = arrayObject.map(arr => ( { ...arr, order_date: this._date } ) )
            const makeNewRows = await CrudModelInstance.newRowArray(columns, tableName);
            if (makeNewRows === null) {
                throw createError(404, 'Customer or items not found')
            }

            return makeNewRows;

        } catch(err) {
            throw err;
        }
    }

    async deleteList(date, tableName, colName) {
        try {
            const upperBound = OLService.upper(date);
            const lowerBound = OLService.lower(date);

            const dateObj = {
                upperBound,
                lowerBound
            }

            const deleteDates = await CrudModelInstance.deleteBasedOnDate(tableName, colName, dateObj)
            
            if (!deleteDates) {
                throw createError(404, 'Corresponding dates not found')
            }

            return deleteDates;

        } catch(err) {
            throw err;
        }
    }

    async getCustomerDate(objHolder, tableName, colCustomer, colDate) {
        try {
            const upperBound = OLService.upper(objHolder.date);
            const lowerBound = OLService.lower(objHolder.date);

            const obj = {
                id: objHolder.id,
                upperBound,
                lowerBound
            }

            const customer = await CrudModelInstance.getCustomerByDate(obj, tableName, colCustomer, colDate);

            if (!customer) {
                throw createError(404, 'Customer has no items');
            }
            return customer;
        } catch(err) {
            throw err;
        }
    }
}