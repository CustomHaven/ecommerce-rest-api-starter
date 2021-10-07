const expressLoader = require('./express');
const routeLoader = require('../routes'); //do routes
const passportLoader = require('./passport');
const swaggerLoader = require('./swagger');
const logger = require('../logger');

module.exports = async (app) => {

    const expressApp = await expressLoader(app);

    const passport = await passportLoader(expressApp);

    await routeLoader(app, passport);

    await swaggerLoader(app);

    app.get('*', (req, res) => {
        res.redirect('/auth/login');
    })
    // Error Handler
    app.use((err, req, res, next) => {
        const { message, status } = err;
        logger.http(status);
        logger.error(message)
        return res.status(status).send({ message });
    });
}