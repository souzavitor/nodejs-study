"use strict";

const mongoose = require("mongoose");

/**
 * Create Mongo connection
 *
 * @return mongoose.connection
 */
function connectDb() {
  let user = process.env.DB_USERNAME || "";
  let host = process.env.DB_HOST;
  let port = process.env.DB_PORT || "27017";
  let dbname = process.env.DB_NAME;

  if (user) {
    user =
      process.env.DB_USERNAME && process.env.DB_PASSWORD
        ? ":" + process.env.DB_PASSWORD + "@"
        : "";
  }
  return mongoose.connect(
    "mongodb://" + user + host + ":" + port + "/" + dbname
  );
}

module.exports = connectDb;
