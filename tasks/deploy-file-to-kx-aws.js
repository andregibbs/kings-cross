// deploys a file with data to the kx aws s3 instance

const AWS = require('aws-sdk');
const chalk = require('chalk')

const REGION = 'eu-west-2';
const AWS_ACCESS_KEY_ID = 'AKIAR67JJICY7FCFDQXR';
const AWS_SECRET_ACCESS_KEY = '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';

const BUCKET = 'kxuploads';
const FOLDER = 'home-of-innovation-dynamic/';

function DeployFileToKXAWS(data, filename, callback, subdir = false, contentType = 'application/json') {

  const s3 = new AWS.S3({
    region: REGION,
    version: 'latest',
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
  })

  if (contentType === 'application/json') {
    data = JSON.stringify(data)
  }

  s3.putObject({
    Bucket: BUCKET,
    Key: subdir ? `${FOLDER}${subdir}/${filename}` : FOLDER+filename,
    Body: data,
    ContentType: contentType
  }, (err, data) => {
    if (callback) {
      return callback(err, data)
    }
    if (err) {
      console.log(err.stack)
    } else {
      console.log(chalk.cyan(`${filename} successfully deployed to ${FOLDER}`))
    }
  })

}

module.exports = DeployFileToKXAWS
