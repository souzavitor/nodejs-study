import mongoose = require("mongoose");

export function connection() : mongoose.Connection {
  let user : string = '';
  let host : string = process.env.DB_HOST;
  let port : string = process.env.DB_PORT || '27017';
  let dbname : string = process.env.DB_NAME;

  user = process.env.DB_USERNAME || '';
  if (user) {
    user = process.env.DB_USERNAME && process.env.DB_PASSWORD ?
      ':' + process.env.DB_PASSWORD + '@' :
      '';
  }
  return mongoose.createConnection(
    'mongodb://' + user + host +
    ':' + port +
    '/' + dbname
  );
}