/* eslint-disable space-unary-ops */
/* eslint-disable import/no-extraneous-dependencies */
const winston = require('winston');
const expressWinston = require('express-winston');

module.exports.requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

module.exports.errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});
