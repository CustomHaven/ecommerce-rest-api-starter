const createError = require('http-errors');
const CrudModel = require('../models/CrudModel');
const CrudModelInstance = new CrudModel();

module.exports = class TableService {

    async table(tablename) {
        try {
            const theTable = await CrudModelInstance.tableSize(tablename);

            if (!theTable) {
                throw createError(500, "No table in server");
            }

            return theTable;

        } catch (err) {
            throw err;
        }
    }

    async allRows(tableName) {
        try {

            const everyRow = await CrudModelInstance.getAll(tableName);

            if (!everyRow) {
                throw createError(404, 'Invalid path');
            }

            return everyRow;

        } catch(err) {
            throw err;
        }
    }

    async findOneRow(id, tableName, idName) {
        try {
            const theRow = await CrudModelInstance.findOne(id, tableName, idName);
            if (!theRow) {
                throw createError(404, 'Element not found');
            }
            const [row] = theRow;

            return row;
            
        } catch(err) {
            throw err;
        }
    }
    async newRow(col, tableName) {
        try {
            const row = await CrudModelInstance.newRow(col, tableName);

            if (!row) {
                throw createError(409, 'Not possible to make a new row')
            }
            return row;
        } catch(err) {
            throw err;
        }
    }
    async updateRow(id, col, tableName, idName) {
        try {
            if (col.password) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(col.password, salt);
                col.password = hash;
            }
            const user = await CrudModelInstance.updateRow(id, col, tableName, idName);

            if (!user) {
                throw createError(409, 'One or more invalid inputs');
            }

            return user;
            
        } catch(err) {
            throw err;
        }
    }

    async removeRow(id, tableName, idName) {
        try {

            const userRemoved = await CrudModelInstance.deleteRow(id, tableName, idName);

            if (userRemoved === null) {
                throw createError(404, 'Invalid ID no element found');
            }
            return userRemoved;

        } catch(err) {
            throw err;
        }
    }

    async findOneBasedOnFkey(fKey, tablename, fkName) {
        try {
            const theRow = await CrudModelInstance.findOne(fKey, tablename, fkName);
            if (!theRow) {
                throw createError(404, 'Element not found');
            }
            const [row] = theRow;

            return row;
            
        } catch(err) {
            throw err;
        }
    }

    async findAllBasedOnFkey(fKey, tablename, fkName) {
        try {
            const rows = await CrudModelInstance.findAll(fKey, tablename, fkName);
            if (!rows) {
                throw createError(404, 'Element not found');
            }

            return rows;
            
        } catch(err) {
            throw err;
        }
    }

    async rowsBasedOnFK(pkTableName, fkTableName, fkValue, pkCols, fkColName) {
        try {

            const theRow = await CrudModelInstance.selectFromFkey(pkTableName, fkTableName, fkValue, pkCols, fkColName);
            if (!theRow) {
                throw createError(409, 'Conflict: Invalid columns');
            }
            return theRow;
        } catch (error) {
            throw error;
        }
    }

    // //////////////////////////products, cart_list, id, product_id, cart_id, 6
    async findTotalPriceAndUnits(table1, table2, table1Id, table2Id, table3Col, value, price, quantity) {
        try {
            const rows = await CrudModelInstance.selectPriceAndQuantity(table1, table2, table1Id, table2Id, table3Col, value, price, quantity);
            if (!rows) {
                throw createError(404, 'Element not found');
            }
            const [row] = rows;

            return row;
            
        } catch(err) {
            throw err;
        }
    }

    async findPrice(table1, table2, table1Id, table2Id, table3Col, value, price, quantity) {
        try {
            const rows = await CrudModelInstance.selectPriceV2(table1, table2, table1Id, table2Id, table3Col, value, price, quantity);
            if (!rows) {
                throw createError(404, 'Element not found');
            }
            return rows;
            
        } catch(err) {
            throw err;
        }
    }
}