import * as dotenv from 'dotenv';
dotenv.config();

import * as logger from '../../factories/logger.factory';
import * as sqs from '../../factories/sqs.factory';

import * as Consumer from 'sqs-consumer';
import { EmailService } from '../../services/email.service';

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

    let data = {
      name: msgBody.data.name,
      email_verification_link: process.env.FRONTEND_HOST + '/users/confirm-email-verification?key=' + msgBody.data.email_verification_token
    };

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
  console.log(err);
});

app.start();