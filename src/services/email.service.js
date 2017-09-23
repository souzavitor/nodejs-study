'use strict';

const EmailTemplate = require('email-templates');

const path = require('path');

const sqs = require('../factories/sqs.factory');
const mailer = require('../factories/mailer.factory');


exports.sendEmail = (email) => {
  // setup e-mail data with unicode symbols
  let mailOptions = {
    from: process.env.MAIL_FROM,
    to: email.to,
    subject: email.subject,
    html : ''
  };

  let data = {
    name: email.data.name,
    email_verification_link: process.env.FRONTEND_HOST + '/login?verify_email=' + email.data.email_verification_token
  };

  return new Promise((resolve, reject) => {
    let templateDir = path.join(
      __dirname,
      '../../',
      'templates',
      email.template
    );

    let template = new EmailTemplate(templateDir)

    template.render(data, (err, result) => {
      if (err) {
        reject(err);
      }

      mailOptions.html = result.html;
      mailer.sendMail(mailOptions)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
    });
  });
}

exports.queueEmail = (email) => {
  let url = process.env.SEND_EMAIL_QUEUE_URL;
  let sqsParams = {
    MessageBody: JSON.stringify(email),
    QueueUrl: url
  };
  return new Promise((resolve, reject) => {
    sqs.sendMessage(sqsParams, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
