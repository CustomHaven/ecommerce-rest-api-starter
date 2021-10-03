const { Pool } = require('pg');
const { DB } = require('../config');

const pool = new Pool({
    host: DB.PGHOST,
    user: DB.PGUSER,
    database: DB.PGDATABASE,
    password: DB.PGPASSWORD,
    port: DB.PGPORT
})


module.exports = {
  query: (text, params) => {
    return pool.query(text, params)
  },
  // pool: pool
}