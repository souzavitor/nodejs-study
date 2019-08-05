const chai = require("chai");
const expect = chai.expect;
var sinon = require("sinon");

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDb = require("./mongoose.factory");

describe("Mongoose factory", () => {
  describe("Mongoose configuration", () => {
    it("should have host, port and database name properly configured", () => {
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

      sinon.stub(mongoose, "connect");
      let databaseUrl = "mongodb://" + user + host + ":" + port + "/" + dbname;

      connectDb();
      expect(mongoose.connect.calledOnce).to.be.true;
      expect(mongoose.connect.firstCall.args[0]).to.be.equal(databaseUrl);
    });
  });
});
