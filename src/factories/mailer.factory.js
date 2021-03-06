"use strict";

const nodemailer = require("nodemailer");
const htmlToText = require("nodemailer-html-to-text").htmlToText;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});
transporter.use("compile", htmlToText());

module.exports = transporter;
