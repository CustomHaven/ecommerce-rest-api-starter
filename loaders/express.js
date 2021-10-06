const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const { SESS } = require('../config');
const db = require('../db');
const pgSession = require('connect-pg-simple')(session); // bring this back
const flash = require('connect-flash');

// console.log(require('crypto').randomBytes(64).toString('hex'));
module.exports = (app) => {

    const IN_PROD = process.env.NODE_ENV === 'production';

    app.set('view engine', 'ejs');

    app.use(morgan('dev'));

    app.use(cors());

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));
    
    // app.use((req, res, next) => {
    //     res.setHeader('Access-Control-Allow-Origin', '*')
    //     res.setHeader(
    //         'Access-Control-Allow-Headers',
    //         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    //     )
    
    //     next()
    // })

    // (async () => {
    //     const client = await db.pool.connect();
    //     // console.log(client);
    //     try { // just a test
    //         const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
    //         console.log(res.rows[0])
    //     } finally {
    //         client.release()
    //     }
    // })().catch(err => console.log(err.stack));

    app.use(session({
        name: SESS.NAME,
        secret: SESS.SECRET,
        saveUninitialized: false,
        resave: false,
        store: new pgSession({
            pool: db,
            // tableName: 'session'
        }),
        cookie: {
            maxAge: 1000 * 60 * 3,
            secure: IN_PROD,
            sameSite: true
        }
    }));


    app.use(flash());

    return app;
}


// const options = {
//   swaggerDefinition: {
//     openapi: "3.0.1",
//     info: {
//       title: "My apis in swaager",
//       version: "1.0.0",
//     },
//     servers: [
//       {
//         url: "http://localhost:8082",
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [],
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
// };
