const db = require('../db');
const moment = require('moment');
// const pgp = require('pg-promise')({ capSQL: true });
const updateHelper = require('../helpers/updateHelper');
const createHelper = require('../helpers/createHelper');
const e = require('cors');

module.exports = class CrudModel {
    constructor(data = {}) {
        this.fKeys = data.fKeys;
        this.count = data.count;
        this._date = moment().format("YYYY-MM-DD HH:mm:ss"); // 'NOW()'
    }
    async getAll(tableName) {
        try {
            console.log(this.date)
            console.log(typeof this.date)

            const result = await db.query(`SELECT * FROM ${tableName}`)
            if (result?.rows?.length) {
                return result?.rows
            } 
            return null
        } catch(err) {
            throw err
        }
    }
    async findOne(id, tableName, idName) {
        try {
            const result = await db.query(`SELECT * FROM ${tableName} WHERE ${idName} = $1`, [id])

            if (result.rows?.length) {
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
            // console.log(sqlQuery);
            const colValues = Object.values(col);
            // console.log(colValues)
            const result = await db.query(sqlQuery, colValues);
            //console.log(result)
            if (result.rows?.length > 0) {
                return result.rows[0]
            }
            return null;
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
            console.log(this.date)
            console.log(typeof this.date)

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
            const { lower, upper } = date;

            // SELECT * FROM order_list
            // WHERE order_date > '2021-09-02 23:25:30' AND order_date < '2021-09-02 23:25:50';

            const result = await db.query(`DELETE FROM ${tableName} 
                                        WHERE ${colName} > $1
                                        AND ${colName} < $2`, [lower, upper]);
            if (result?.rowCount >= 1) {
                return result.rowCount;
            }
            return null
        } catch(err) {
            throw err
        }
    }
}