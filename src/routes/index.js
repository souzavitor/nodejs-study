'use strict';

const path = require('path');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const appLogger = require('../factories/logger.factory');

// get routers
const placeRouter = require('./place.router');
const userRouter = require('./user.router');

/**
 * Register application pre middleware
 *
 * Register body parser
 * Register CORS handler
 *
 * @param express app
 * @return void
 */
exports.registerPreMiddleware = (app) => {
  registerLoggerHandler(app);
  registerBodyParserHandler(app);
  registerCorsHandler(app);
}

/**
 * Register application pos middleware
 *
 * Register error handler and not found handler
 *
 * @param express app
 * @return void
 */
exports.registerPosMiddleware = (app) => {
  registerErrorHandler(app);
  registerNotFoundHandler(app);
}

/**
 * Set application routes
 *
 * @param express app
 * @return void
 */
exports.registerRoutes = (app) => {
  app.get('/', (req, res) => {
    res.send({'version':'1.0.0'});
  });
  app.use('/api/v1/places', placeRouter);
  app.use('/api/v1/users', userRouter);
}

/**
 * Register error handler for status code 500
 *
 * @param express app
 * @return void
 */
function registerErrorHandler(app) {
  if (process.env.APP_ENV === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500)
        .send({message: err.message, error: err});
    });
  }

  app.use((err, req, res, next) => {
    res.status(err.status || 500)
      .send(err.message);
  });
}

/**
 * Register handler for page not found
 *
 * @param express app
 * @return void
 */
function registerNotFoundHandler(app) {
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    res.status(404);
    res.send({'error': 'page not found.'});
  });
}

/**
 * Register handler for CORS
 *
 * @param express app
 * @return void
 */
function registerCorsHandler(app) {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      res.status(200);
      res.send();
    } else {
      next();
    }
  });
}

/**
 * Register handler for application logs
 *
 * @param express app
 * @return void
 */
function registerLoggerHandler(app) {
  app.use(expressWinston.logger(appLogger.loggerOptions));
}

/**
 * Register body parser
 *
 * @param express app
 * @return void
 */
function registerBodyParserHandler(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
}
