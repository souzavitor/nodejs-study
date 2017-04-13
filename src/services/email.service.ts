import { EmailModel } from '../models/email.model';
import { EmailTemplate } from 'email-templates';

import * as path from 'path';

import * as sqs from '../factories/sqs.factory';
import * as mailer from '../factories/mailer.factory';

export class EmailService {
  public static sendEmail(email : EmailModel) : Promise<Object> {
    // setup e-mail data with unicode symbols
    let mailOptions = {
      from: process.env.MAIL_FROM,
      to: email.to,
      subject: email.subject,
      html : ''
    };

    let data = {
      name: email.data.name,
      email_verification_link: process.env.FRONTEND_HOST + '/users/confirm-email-verification?key=' + email.data.email_verification_token
    };

    return new Promise<Object>((resolve, reject) => {
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
          .then((result : any) => resolve(result))
          .catch((err : any) => reject(err))
      });
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
