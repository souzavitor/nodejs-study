#!/usr/bin/env node
'use strict';

const dotenv = require('dotenv');
dotenv.config();

const logger = require('../../../src/factories/logger.factory');
const sqs = require('../../../src/factories/sqs.factory');

const Consumer = require('sqs-consumer');
const EmailService = require('../../../src/services/email.service');

let url = process.env.SEND_EMAIL_QUEUE_URL;
let app = Consumer.create({
  queueUrl: url,
  batchSize: 10,
  sqs: sqs,
  handleMessage: (message, done) => {
    let msgBody = JSON.parse(message.Body);

    let logInfo = {
      username : msgBody.data.username,
      filename : __filename
    };

    logger.info('New message received.', logInfo);

    return EmailService.sendEmail(msgBody).then((result) => {
      logger.info('Email sent.', logInfo);
      done();
    }).catch(err => {
      logger.error('Could not send the email', logInfo);
      done(err);
    });
  }
});

app.on('error', function (err) {
  logger.error('Something has gone wrong!', err);
});

app.start();