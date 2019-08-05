const chai = require("chai");
const expect = chai.expect;

const dotenv = require("dotenv");
dotenv.config();

const mailer = require("./mailer.factory");

describe("Mailer", () => {
  describe("Mailer is properly configured", () => {
    it("should use SMTP", () => {
      expect(mailer.transporter.constructor.name).to.be.equal("SMTPTransport");
    });
    it("should have host and port configured", () => {
      expect(mailer.options).to.be.instanceOf(Object);
      expect(mailer.options.host).to.be.equal(process.env.MAIL_HOST);
      expect(mailer.options.port).to.be.equal(process.env.MAIL_PORT);
    });
    it("should have user and password configured", () => {
      expect(mailer.options.auth).to.be.instanceOf(Object);
      expect(mailer.options.auth.user).to.be.equal(process.env.MAIL_USER);
      expect(mailer.options.auth.pass).to.be.equal(process.env.MAIL_PASSWORD);
    });
  });
});
