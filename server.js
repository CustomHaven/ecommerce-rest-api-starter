const express = require('express');
const app = express();
const logger = require('./logger');
const loaders = require('./loaders');

const PORT = process.env.PORT || 4001;

// logger.warn('warn information');
// logger.info('info information');
// logger.error('error information');
// logger.http('http information');
// logger.verbose('verbose information');
// logger.debug('debug information');
// logger.error(new Error('Something broke!'));


async function startServer () {
 // To send app as a prop to an entire directory we need a index.js to handle all the js files in the directory and send the prop to the others
    // app.use(express.static(__dirname + '/public'));
    loaders(app);

    console.log("process.env.NODE_ENV surely?");
    console.log(process.env.NODE_ENV);
    console.log("process.env.NODE_ENV surely?");



    app.listen(PORT, () => {
        if (process.env.NODE_ENV === "production") {
            logger.info(`Server is listening on port #${PORT}`);
        } else {
            logger.info(`Server is listening on port #${process.env.localhost}:${PORT}`);
        }
    });
}

startServer();
