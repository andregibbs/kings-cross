const fetch = require('node-fetch')
const args = process.argv
const ids = args.slice(2, args.length).join(',')
const api_key = "AIzaSyDDEuhagbDhNY1aXOtcrV7LuxAb5UN22S8"

let durations = []

// use api to fetch details of youtube ids
fetch(`https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=contentDetails&key=${api_key}`)
  .then(r => r.json())
  .then(data => {
    // for each id
    if (!data.items.length) {
      return console.log('no video data')
    }
    if (data.items.length !=  args.slice(2, args.length).length) {
      return console.log('one or more ids missing')
    }
    data.items.forEach((item, i) => {
      // get duration value
      const duration = item.contentDetails.duration
      // regex to extract values
      const durationValues = RegExp("(?:([0-9]*)([H|M|S]))", 'gm')
      let matches = []
      let calculatedDuration = 0


      // while we have matches
      while ((matches = durationValues.exec(duration)) !== null) {
        // convert values to minutes
        switch (matches[2]) {
          case 'H':
            calculatedDuration += parseInt(matches[1]) * 60
            break;
          case 'M':
            calculatedDuration += parseInt(matches[1])
            break;
          case 'S':
            calculatedDuration += parseInt(matches[1]) / 60
            break;
          default:
        }
      }
      // ceil the minute value
      durations.push(Math.ceil(calculatedDuration))
      console.log(duration)
    });
    console.log('total:', durations.reduce((a,b) => a + b))
  })
  .catch(e => console.log(e))
