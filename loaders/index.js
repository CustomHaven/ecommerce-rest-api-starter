const expressLoader = require('./express');

module.exports = async (app) => {

    await expressLoader(app);





    // Error Handler
    app.use((err, req, res, next) => {

        const { message, status } = err;
    
        return res.status(status).send({ message });
    });
}