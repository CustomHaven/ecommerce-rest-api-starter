const { Pool } = require('pg');
const { DB, NODE_ENV } = require('../config');
const logger = require('../logger');

const devConfig = {
  host: DB.PGHOST,
  user: DB.PGUSER,
  database: DB.PGDATABASE,
  password: DB.PGPASSWORD,
  port: DB.PGPORT
}

const proConfig = {
  connectionString: DB.DATABASE
}

logger.info('started server in the index.js file off db');
logger.info(NODE_ENV);
logger.info(NODE_ENV);
logger.info(NODE_ENV);
logger.info('started server in the index.js file off db');

const pool = new Pool(NODE_ENV === 'development' ? devConfig : proConfig)


module.exports = {
  query: (text, params) => {
    return pool.query(text, params)
  },
  pool: pool
}