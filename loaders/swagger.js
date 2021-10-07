const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
// const basicAuth = require('express-basic-auth');

const options = {
    apis: ['../routes/index.js'],
    swaggerDefinition: swaggerDocument    
}
const specs = swaggerJsDoc(options);
module.exports = (app) => {
  // Serves Swagger API documentation to /docs url
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true
  }));
}