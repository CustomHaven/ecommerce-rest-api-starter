const db = require('../db');
// const moment = require('moment');
// const pgp = require('pg-promise')({ capSQL: true });
const updateHelper = require('../helpers/updateHelper');
const createHelper = require('../helpers/createHelper');

module.exports = class CrudModel {
    constructor(data = {}) {
        this.fKeys = data.fKeys;
        this.count = data.count;
    }
    async getAll(tableName) {
        try {
            const result = await db.query(`SELECT * FROM ${tableName}`, [])

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
            console.log(sqlQuery);
            const colValues = Object.values(col);
            console.log(colValues)
            const result = await db.query(sqlQuery, colValues);

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
}