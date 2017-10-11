'use strict';

const winston = require('winston');

const loggerOptions = {
  level: process.env.LOG_LEVEL,
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL,
    }),
    new winston.transports.File({
      level: process.env.LOG_LEVEL,
      filename: process.env.LOG_PATH
    })
  ]
};
exports.loggerOptions = loggerOptions;
exports.logger = new winston.Logger(loggerOptions);
