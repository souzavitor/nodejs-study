'use strict';

const express = require('express');

const routes = require('./routes/');

const app = express();

routes.registerPreMiddleware(app);
routes.registerRoutes(app);
routes.registerPosMiddleware(app);

module.exports = app;
