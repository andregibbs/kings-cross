/*
  Deploy dynamic hoi data script
  run from npm tasks "npm run hoi-dynamic [staging|live]"

  this script runs the HOITemplates task, generating and returning a json object containging
  all page components that are setup to be dynamicComponentData

  at the moment this is only used for the group component for episode pages

  the file is generated and uploaded to our kx uploads bucket

  the two possible urls generated are
  https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/hoi-dynamic.json
  https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/hoi-dynamic-staging.json

  these are used by the project components to load dynamic content

*/


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

  const s3 = new AWS.S3({
    region: REGION,
    version: 'latest',
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
  })

  s3.putObject({
    Bucket: BUCKET,
    Key: FOLDER+filename,
    Body: JSON.stringify(data),
    ContentType: 'application/json'
  }, (err, data) => {

    if (err) console.log(err.stack)
    else console.log(`Success: data deployed to ${FOLDER+filename}`)

  })
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

  HOITemplates(true, (data) => {

    if (isLiveTask) {
      prompt.start();
      prompt.get({
        description: "You are deploying live. Type 'true' or 't' to confirm.",
        type: 'boolean'
      }, (err, result) => {
        if (result.question) {
          s3Put(data, fileName)
        }
      })
    } else {
      s3Put(data, fileName)
    }

  })

}

DeployHOIDynamicData()
