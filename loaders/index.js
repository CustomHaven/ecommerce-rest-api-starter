const expressLoader = require('./express');
const routeLoader = require('../routes'); //do routes

module.exports = async (app) => {

    await expressLoader(app);


    routeLoader(app);


    // Error Handler
    app.use((err, req, res, next) => {

        const { message, status } = err;
    
        return res.status(status).send({ message });
    });
}