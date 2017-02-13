"use strict";

import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

global.Promise = require('q').Promise;
import mongoose = require("mongoose");
mongoose.Promise = global.Promise;

import PlaceRouter from './routes/place.router';

/**
 * The application.
 *
 * @class App
 */
class App {
  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware() : void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {
        res.status(200);
        res.send();
      } else {
        next();
      }
    });
  }

  // Configure API endpoints.
  private routes() : void {
    // catch 404 and forward to error handler
    this.express.use(
      (err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction) => {
        err.status = 404;
        res.send({});
      });
    this.express.use('/api/v1/places', PlaceRouter);
  }
}

export default new App().express;
