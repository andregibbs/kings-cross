const DeployFileToKXAWS = require('./deploy-file-to-kx-aws');
var argv = require('yargs').argv
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const LOCAL_BUILD_FOLDER = path.join( __dirname, '../build/' )

const {
  SURVEY_DATA_LIVE_FILENAME,
  SURVEY_DATA_STAGING_FILENAME,
  SURVEY_DATA
} = require('../src/data/kxSurveyData');

function DeployKXSurveyData() {

  // staging arguments
  const stageArg = argv._[0] || false
  if (!stageArg || (stageArg !== "staging" && stageArg !== "live")) {
    console.log("Missing/incorrect stage argument.")
    console.log("Usage: npm run hoi-dynamic [staging|live]")
    return
  }

  const isLiveTask = stageArg === "live" ? true : false
  const fileName = isLiveTask ? SURVEY_DATA_LIVE_FILENAME : SURVEY_DATA_STAGING_FILENAME

  // console.log(isLiveTask, fileName, SURVEY_DATA)

  fs.writeFileSync(LOCAL_BUILD_FOLDER + '/' + SURVEY_DATA_STAGING_FILENAME, JSON.stringify(SURVEY_DATA))
  console.log("KX Survey: local data written")

  DeployFileToKXAWS(SURVEY_DATA, fileName, (err, data) => {
    if (err) console.log(err.stack)
    else console.log(chalk.cyan(`KX Survey Deploy: ${stageArg} survey data successfully deployed.`))
  })

}

DeployKXSurveyData()
