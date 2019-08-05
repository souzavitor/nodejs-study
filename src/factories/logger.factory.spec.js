const chai = require("chai");
const should = chai.should();
const expect = chai.expect;

const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const winston = require("winston");
const logger = require("./logger.factory").logger;

describe("Logger", () => {
  describe("Logger is logging properly", () => {
    it("should be able to warn", () => {
      expect(logger.warn).to.be.instanceof(Object);
    });
    it("should be able to info", () => {
      expect(logger.info).to.be.instanceof(Object);
    });
    it("should be able to verbose", () => {
      expect(logger.verbose).to.be.instanceof(Object);
    });
    it("should be able to inform error", () => {
      expect(logger.error).to.be.instanceof(Object);
    });
    it("should be able to debug", () => {
      expect(logger.debug).to.be.instanceof(Object);
    });
  });
  describe("Logger is properly configured", () => {
    it("should have log level", () => {
      expect(logger.level).to.be.equal(process.env.LOG_LEVEL);
    });
    it("should have two transports configured: Console and File", () => {
      expect(logger.transports).to.be.instanceOf(Array);
      expect(logger.transports.length).to.be.equal(2);
      expect(logger.transports[0]).to.be.instanceOf(winston.transports.Console);
      expect(logger.transports[1]).to.be.instanceOf(winston.transports.File);
    });
    it("should have one File transport properly configured", () => {
      let logPath = process.env.LOG_PATH;
      expect(logger.transports[1].filename, path.basename(logPath));
      expect(logger.transports[1].dirname, path.dirname(logPath));
    });
    it("should not exit on error", () => {
      expect(logger.exitOnError).to.be.equal(false);
    });
  });
});
