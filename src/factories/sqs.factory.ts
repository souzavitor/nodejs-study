import { SQS, config } from 'aws-sdk';
config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});
let sqs = new SQS({region: process.env.AWS_REGION});
export = sqs;