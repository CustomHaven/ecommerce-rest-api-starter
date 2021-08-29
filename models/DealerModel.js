const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });


module.exports = class Dealers {
    async getAll() {

        try {
            const result = await db.query(`SELECT * FROM dealers`, [])

            if (result?.rows?.length) {
                return result?.rows
            } else {
                return [];
            }
        } catch(err) {
            throw err
        }
    }
    async findOne(id) {
        try {
            const result = await db.query(`SELECT * FROM dealers WHERE did = $1`, [id])

            if (result.rows?.length) {
                return result.rows[0]
            }
          
            return null;
            
        } catch(err) {
            throw err
        }
    }
}