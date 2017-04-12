import * as dotenv from 'dotenv';

dotenv.config();

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
        EmailService.sendEmail(msgBody);
        return done();
    }
});

app.on('error', function (err) {
    console.log(err);
});