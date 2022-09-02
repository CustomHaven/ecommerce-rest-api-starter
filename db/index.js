const { Pool } = require('pg');
const { DB } = require('../config');
// require('dotenv').config();

const devConfig = {
  host: DB.PGHOST,
  user: DB.PGUSER,
  database: DB.PGDATABASE,
  password: DB.PGPASSWORD,
  port: DB.PGPORT,
}

const proConfig = {
  connectionString: DB.DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
}


const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);
// pool
// .connect()
// .then(() => console.log("connected to database"))
// .catch((err) => console.error("Something wrong in connection:", err));

module.exports = {
  query: (text, params) => {
    return pool.query(text, params)
  },
  pool: pool.connect().then(() => console.log("Connected to Database")).catch((err) => console.log("Something went wrong:", err)) // to much..
}