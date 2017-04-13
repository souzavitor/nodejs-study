import { Logger, transports } from 'winston';

let logger = new Logger({
  level: process.env.LOG_LEVEL,
  transports: [
    new transports.File({
      filename: process.env.LOG_PATH
    })
  ]
});

export = logger;