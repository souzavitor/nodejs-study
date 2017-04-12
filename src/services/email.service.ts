import { EmailModel } from '../models/email.model';

import * as nodemailer from 'nodemailer';
import * as htmlToText from 'nodemailer-html-to-text';

import * as sqs from '../factories/sqs.factory';

export class EmailService {
  public static sendEmail(email : EmailModel) : Promise<Object> {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });
    transporter.use('compile', htmlToText())
    let html = 'Teste';

    // setup e-mail data with unicode symbols
    let mailOptions = {
      from: process.env.from,
      to: email.to,
      subject: email.subject,
      html: html
    };
    return new Promise<Object>((resolve, reject) => {
      transporter.sendMail(mailOptions)
        .then((result : any) => resolve(result))
        .catch((err : any) => reject(err))
    });
  }

  public static queueEmail(email : EmailModel) : Promise<Object> {
    let url = process.env.SEND_EMAIL_QUEUE_URL;
    let sqsParams = {
      MessageBody: JSON.stringify(email),
      QueueUrl: url
    };
    return new Promise<Object>((resolve, reject) => {
      sqs.sendMessage(sqsParams, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
}
