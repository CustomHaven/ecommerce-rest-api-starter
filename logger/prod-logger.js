const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, errors, json } = format;

function buildProdLogger() {
  
  return createLogger({
    level: 'debug',
    format: combine(
      timestamp(),
      errors({ stack: true }),
      json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.Console(),
      new transports.File({
        filename: 'logs/error.log',
        level: 'debug',
      })
    ],
  });
}

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }


module.exports = buildProdLogger;