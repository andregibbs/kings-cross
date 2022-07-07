const {getVideoDurationInSeconds} = require('get-video-duration')
const args = process.argv
const url = args[2]

getVideoDurationInSeconds(url).then(duration => {
  console.log(Math.ceil(duration / 60))
})
