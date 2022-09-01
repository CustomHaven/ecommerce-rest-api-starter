const expressLoader = require('./express');
const routeLoader = require('../routes/v2'); //do routes
const passportLoader = require('./passport');
const swaggerLoader = require('./swagger');
const logger = require('../logger');

module.exports = async (app) => {

    const expressApp = await expressLoader(app);

    const passport = await passportLoader(expressApp);

    await routeLoader(app, passport);

    await swaggerLoader(app);
    // All incorrect paths not mentioned in routeLoader
    app.all('*', (req, res, next) => {
        throw next({statusCode: 404, message: "Invalid Path"});
    });
    // Error Handler
    app.use((err, req, res, next) => {
        const { message, statusCode, status } = err;
        logger.http(statusCode); // reason is other third parties might have called it statusCode
        logger.http(status); // reason is other third parties might have called it status
        logger.error(message);
        return res.status(statusCode ? statusCode : status).send({ message });
    });
}