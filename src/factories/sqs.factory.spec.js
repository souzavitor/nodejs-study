const chai = require("chai");
const expect = chai.expect;

const dotenv = require("dotenv");
dotenv.config();

const sqs = require("./sqs.factory");

describe("AWS SQS Factory", () => {
  describe("SQS configuration", () => {
    it("should be configured properly according to .env", () => {
      expect(sqs.config.constructor.name).to.be.equal("Config");
      expect(sqs.config).to.be.instanceOf(Object);
      expect(sqs.config.region).to.be.equal(process.env.AWS_REGION);
      expect(sqs.config.credentials.accessKeyId).to.be.equal(
        process.env.AWS_ACCESS_KEY_ID
      );
      expect(sqs.config.credentials.secretAccessKey).to.be.equal(
        process.env.AWS_SECRET_KEY
      );
    });
  });
});
