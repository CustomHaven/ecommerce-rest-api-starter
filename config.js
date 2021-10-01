require('dotenv').config();
module.exports = {
    PORT: process.env.PORT,
    DB: {
        PGHOST: process.env.PGHOST,
        PGUSER: process.env.PGUSER,
        PGDATABASE: process.env.PGDATABASE,
        PGPASSWORD: process.env.PGPASSWORD,
        PGPORT: process.env.PGPORT
    },
    EMAIL: {
        ESERVICE: process.env.MAIL_SERVICE,
        EUSER: process.env.MAIL_USER,
        EPASSWORD: process.env.MAIL_PASSWORD,
        EFROM: process.env.MAIL_FROM
    },
    SESS: {
        SECRET: process.env.SESSION_SECRET,
        NAME: process.env.SESSION_NAME
    },
    NODE_ENV: process.env.NODE_ENV
}