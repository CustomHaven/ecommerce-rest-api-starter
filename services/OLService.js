const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();
const moment = require('moment');

module.exports = class OLService {
    constructor() {
        // this.fKeys = data.fKeys;
        // this.count = data.count;
        this._date = 'NOW()'
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
            console.log(this._date)

            const columns = arrayObject.map(arr => ( { ...arr, order_date: this._date } ) )
            const makeNewRows = await CrudModelInstance.newRowArray(columns, tableName);
            if (makeNewRows === null) {
                throw createError(404, 'FAILED!!!!!!!!!!!!!')
            }


            return makeNewRows;

        } catch(err) {
            throw err;
        }



    }
}