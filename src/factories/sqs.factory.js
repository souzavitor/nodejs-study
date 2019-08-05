const AWS = require("aws-sdk");
// Set the region and credentials according to .env
AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

// Create SQS service client
const sqs = new AWS.SQS();

module.exports = sqs;
