const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');


module.exports = (app) => {


    app.use(morgan('dev'));

    app.use(cors());

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));

    return app;
}



