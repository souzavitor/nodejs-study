"use strict";

const mongoose = require("mongoose");

/**
 * Create Mongo connection
 *
 * @return mongoose.connection
 */
function createConnection() {
  var user = "";
  var host = process.env.DB_HOST;
  var port = process.env.DB_PORT || "27017";
  var dbname = process.env.DB_NAME;

  user = process.env.DB_USERNAME || "";
  if (user) {
    user =
      process.env.DB_USERNAME && process.env.DB_PASSWORD
        ? ":" + process.env.DB_PASSWORD + "@"
        : "";
  }
  return mongoose.createConnection(
    "mongodb://" + user + host + ":" + port + "/" + dbname
  );
}

module.exports = createConnection();
