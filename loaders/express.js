const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const { SESS } = require('../config');
const db = require('../db');
const pgSession = require('connect-pg-simple')(session); // bring this back
const flash = require('connect-flash');
const logger = require('../logger');

// console.log(require('crypto').randomBytes(64).toString('hex'));
module.exports = (app) => {

    app.set('view engine', 'ejs');

    app.use(morgan('dev'));

    app.use(cors());

    console.log('process.env.NODE_ENVS')
    console.log(process.env.NODE_ENV)
    console.log('process.env.NODE_ENVS')

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use(session({
        name: SESS.NAME,
        secret: SESS.SECRET,
        saveUninitialized: false,
        resave: false,
        store: new pgSession({
            pool: db
            // tableName: 'session'
        }),
        cookie: {
            maxAge: 1000 * 60 * 60,
            secure: process.env.NODE_ENV ? true : false,
            sameSite: true
        }
    }));

    app.use(flash());

    return app;
}