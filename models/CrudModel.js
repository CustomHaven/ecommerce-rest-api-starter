const db = require('../db');
const moment = require('moment');
const updateHelper = require('../helpers/updateHelper');
const createHelper = require('../helpers/createHelper');
const priceHelper = require('../helpers/priceHelper');
const threeTableHelper = require('../helpers/threeTableHelper');
const fkTableHelper = require("../helpers/fkTableHelper"); //
const totalPriceQuantity = require("../helpers/priceQuantityHelper"); //
const priceHelperV2 = require("../helpers/priceHelperv2"); //

module.exports = class CrudModel {
    constructor(data = {}) {
        this.fKeys = data.fKeys;
        this.count = data.count;
        this._date = moment().format("YYYY-MM-DD HH:mm:ss"); // 'NOW()'
    }

    async tableSize(tableName) {
        try {
            const table = await db.query(`SELECT COUNT(*) FROM ${tableName}`);

            if (table?.rows?.length) {
                return table.rows[0];
            }
        } catch(err) {
            throw err;
        }
    }

    async getAll(tableName) {
        try {
            const result = await db.query(`SELECT * FROM ${tableName}`);
            if (result?.rows?.length) {
                return result?.rows
            } 
            return null
        } catch(err) {
            throw err;
        }
    }
    async findOne(id, tableName, idName) {
        try {
            const result = await db.query(`SELECT * FROM ${tableName} WHERE ${idName} = $1`, [id])
            if (result.rows?.length) {
                return result.rows;
            }
          
            return null;
            
        } catch(err) {
            throw err
        }
    }
    async findAll(id, tableName, idName) {
        try {
            const result = await db.query(`SELECT * FROM ${tableName} WHERE ${idName} = $1`, [id])
            if (result.rows?.length) {
                return result.rows;
            }
          
            return null;
            
        } catch(err) {
            throw err
        }
    }
    async findOneByEmail(email, tableName, colName) {
        try {
            const result = await db.query(`SELECT * FROM ${tableName} WHERE ${colName} = $1`, [email])

            if (result.rows?.length > 0) {
                return result.rows
            }

            return null;
        } catch(err) {
            throw err
        }
    }
    async newRow(col, tableName) {
        try {
            const sqlQuery = createHelper(col, tableName);
            const colValues = Object.values(col);
            const result = await db.query(sqlQuery, colValues);
            if (!result) {
                return null
            } else {
                if (result.rows?.length > 0) {
                    return result.rows[0]
                }
                return null;
            }
        } catch(err) {
            throw new Error(err);
        }
    }
    async updateRow(id, col, tableName, idName) {
        try {
            const colValues = Object.values(col);
            colValues.unshift(id);
            const sqlQuery = updateHelper(col, tableName, idName);
            const result = await db.query(sqlQuery, colValues);
            if (result?.rows?.length) {
                return result.rows[0];
            }
            return null;
        } catch(err) {
            throw new Error(err)
        }
    }
    async deleteRow(id, tableName, idName) {
        try {
            const result = await db.query(`DELETE FROM ${tableName}
                                    WHERE ${idName} = $1`, [id]);

            if (result?.rowCount >= 1) {
                return result.rowCount;
            }
            return null
        } catch(err) {
            throw new Error(err);
        }
    }

    //// BASED ON FKEY SECTIONS!
    async fetchName(str, tableName, colName) {
        try {
            const result = await db.query(`SELECT * FROM ${tableName} 
                                        WHERE ${colName} = $1`, [str]);

            if (result?.rows?.length) {
                return result?.rows[0];
            }

            return null
        } catch(err) {
            throw err
        }
    }

    async findByUsername(name, tableName) {
        try {
            const result = await db.query(`SELECT * FROM ${tableName} WHERE name = $1`, [name])

            if (result.rows?.length) {
                return result.rows
            }
          
            return null;
            
        } catch(err) {
            throw err
        }
    }

    async deleteBasedOnFKey(fKeyid, tableName, fKeyIdName) {
        try {
            const result = await db.query(`DELETE FROM ${tableName}
                                    WHERE ${fKeyIdName} = $1`, [fKeyid]);
                
            if (result?.rowCount >= 1) {
                return result.rowCount;
            }
            return null
        } catch(err) {
            throw new Error(err);
        }
    }

    async getBasedOnDate(tableName, colName, date) {
        try {

            const result = await db.query(`SELECT * FROM ${tableName} 
                                        WHERE ${colName} = $1`, [date]);
            if (result?.rows?.length) {
                return result?.rows
            } 
            return null
        } catch(err) {
            throw err
        }
    }

    async getCustomerByDate(objHolder, tableName, colCustomer, colDate) {
        try {
            
            const { id, upperBound, lowerBound } = objHolder;

            const result = await db.query(`SELECT * FROM ${tableName} 
                                        WHERE ${colCustomer} = $1
                                        AND
                                        ${colDate} > $2 AND
                                        ${colDate} < $3`, [id, lowerBound, upperBound]);

            if (result?.rows?.length) {
                return result?.rows
            }
            return null;
        } catch(err) {
            throw err
        }
    }

    // two table joined bit where clause will be based on date
    async newRowArray(colArray, tableName) {
        try {
            const sqlQueryInArray = colArray.map(cols => createHelper(cols, tableName));

            const resultArray = [];
            let count = 0
            for (const col of sqlQueryInArray) {
               resultArray.push(await db.query(col, Object.values(colArray[count]))
                                                .then(result => result?.rows) )
               count++;
            }
            const result = resultArray.flat()    

            if (result.length > 0) {
                return result
            }
            return null;
        } catch(err) {
            throw new Error(err);
        }
    }

    async deleteBasedOnDate(tableName, colName, date) {
        try {
            const { lowerBound, upperBound } = date;

            const result = await db.query(`DELETE FROM ${tableName} 
                                        WHERE ${colName} > $1
                                        AND ${colName} < $2`, [lowerBound, upperBound]);

            if (result?.rowCount >= 1) {
                return result?.rowCount;
            }
            return null
        } catch(err) {
            throw err
        }
    }

    async selectPrice(obj, table1, table2, colname, columns) {
        try {
            const price = priceHelper(obj, table1, table2, colname)

            const colValues = Object.values(columns)

            const result = await db.query(price, colValues);

            if (result?.rows?.length) {
                if (result?.rows[0]?.sum !== null) {
                    return result?.rows[0]?.sum
                }
            }
            return null;
        } catch(err) {
            throw err;
        }
    }

    async queryThreeTables(cols, tables, values) {
        try {
            const threeTables = threeTableHelper(cols, tables);
            const result = await db.query(threeTables, values);
            if (result?.rows?.length) {
                return result?.rows;
            }
            return null;
        } catch(err) {
            throw err;
        }
    }


    // two table joined but what will display is the child tables coloumns
    async selectFromFkey(pkTableName, fkTableName, fkValue, pkCols, fkColName) {
        try {
            const sqlQuery = fkTableHelper(pkCols, pkTableName, fkTableName, fkColName);

            const result = await db.query(sqlQuery, [fkValue]);

            if (result?.rows?.length) {
                return result?.rows;
            }
            return null;
        } catch(err) {
            throw new Error(err);
        }
    }

    async selectPriceAndQuantity(table1, table2, table1Id, table2Id, table3Col, value, price, quantity) {
        try {
            const sqlQuery = totalPriceQuantity(table1, table2, table1Id, table2Id, table3Col, price, quantity);

            const result = await db.query(sqlQuery, [value]);

            if (result?.rows?.length) {
                return result?.rows;
            }
            return null;

            // return sqlQuery;
        } catch (error) {
            throw new Error(error)
        }
    }

    async selectPriceV2(table1, table2, table1Id, table2Id, table3Col, value, price, quantity) {
        try {
            const sqlQuery = priceHelperV2(table1, table2, table1Id, table2Id, table3Col, price, quantity);

            const result = await db.query(sqlQuery, [value]);

            if (result?.rows?.length) {
                return result?.rows;
            }
            return null;

            // return sqlQuery;
        } catch (error) {
            throw new Error(error)
        }
    }
}