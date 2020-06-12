var AWS = require('aws-sdk');
var prompt = require('prompt');
var argv = require('yargs').argv

var HOITemplates = require('../gulpfile').HOITemplates

const REGION = 'eu-west-2';
const AWS_ACCESS_KEY_ID = 'AKIAJKZN5DXUYODHENKA';
const AWS_SECRET_ACCESS_KEY = '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';
const BUCKET = 'kxuploads';

const FOLDER = 'home-of-innovation-dynamic/';
const FILENAME = 'hoi-dynamic.json';
const FILENAME_STAGING = 'hoi-dynamic-staging.json';

function s3Put(data, filename) {


}

function DeployHOIDynamicData() {

  const stageArg = argv._[0] || false

  if (!stageArg || (stageArg !== "staging" && stageArg !== "live")) {
    console.log("Missing/incorrect stage argument.")
    console.log("Usage: npm run hoi-dynamic [staging|live]")
    return
  }

  const isLiveTask = stageArg === "live" ? true : false
  const fileName = isLiveTask ? FILENAME : FILENAME_STAGING

  prompt.start();


  HOITemplates(true, (data) => {

    if (isLiveTask) {
      prompt.get({
        description: "You are deploying live. Type 'true' or 't' to Confirm.",
        type: 'boolean'
      }, (err, result) => {
        if (result.question) {
          s3Put
        }
      })
    }

  })



  //
  // return new P

  //
  //   console.log('dynamic data', data)
  //
  // })

  // const filename = staging ? FILENAME_STAGING : FILENAME;
  //
  // const s3 = new AWS.S3({
  //   region: REGION,
  //   version: 'latest',
  //   credentials: {
  //     accessKeyId: AWS_ACCESS_KEY_ID,
  //     secretAccessKey: AWS_SECRET_ACCESS_KEY
  //   }
  // })
  //
  // prompt.start();
  //
  // prompt.get({
  //   description: "You are deploying live. Confirm?",
  //   type: 'boolean'
  // }, (err, result) => {
  //
  //   console.log(err, result)
  // })

  // return new Promise(function(resolve, reject) {
  //
  //   s3.putObject({
  //     Bucket: BUCKET,
  //     Key: FOLDER+filename,
  //     Body: JSON.stringify(data),
  //     ContentType: 'application/json'
  //   }, (err, data) => {
  //
  //     if (err) reject(err.stack)
  //     else resolve('Success', data)
  //
  //   })
  //
  // });

}

DeployHOIDynamicData()
