#!/usr/bin/env node
'use strict';

const debug = require('debug')('source:server');
const http = require('http');
const dotenv = require('dotenv');

// get variables from .env file and set in global variable "process.env"
dotenv.config();

// set "q" promise for mongoose
global.Promise = require('q').Promise;
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const app = require('../src/app');

debug('Express server...');

// set server port
const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

// create express server
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val ) {
  let port = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

module.exports = server;
