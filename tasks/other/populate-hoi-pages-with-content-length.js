const fs = require('fs')
const getFilesInDirectory = require('../helpers').getFilesInDirectory
const SRC_FOLDER = 'src/home-of-innovation/pages/'

const args = process.argv
const pageToPopulate = args[2].replaceAll('/','|')

// only run on single pages as per arg
// use page ids with / instead of |
if (!pageToPopulate) {
  return
}

function getFiles() {
  // Get Files
  var files = getFilesInDirectory(SRC_FOLDER)
  // Filter Files
  files = files.filter(file => {
    const id = file.replace(SRC_FOLDER, '').replace('.json', '')

    if (id === pageToPopulate) {
      return true
    }

    return false

    // remove thise ^ to use these filters below if populating all data
    // ignore if prefixed by underscore
    if (file.indexOf('/_') > - 1) {
      return false
    }
    // only use file if it is part of the following categories
    let categoriesToCapture = ['creativity','entertainment','innovation','lifestyle']
    if (categoriesToCapture.indexOf(id.split('|')[0]) === -1) {
      return false
    }
    // ignore hidden or placeholder pages
    const pageData = getPageData(id)
    console.log(id, pageData.meta && pageData.meta.icon === "series")
    if (pageData.hidden || pageData.placeholder || pageData.meta && pageData.meta.icon === "series") {
      return false
    }
    // ignore if is category page
    if (id.split('|').length <= 1) {
      return false
    }
    // todo add manual flag to pages to hide from search
    return true
  })

  return files;
}

function getPageData(path) {
  // TODO: could update to handle strings with slashes before/after /slug/sub-slug/
  path = path.split('/').join('|')
  const pageData = require('../../' + SRC_FOLDER + path + '.json')
  return pageData
}

function processFiles(files, cb) {
  let pageData = []

  // first pass to process text and find words
  files.forEach((file, index) => {

    delete require.cache[require.resolve(`../../${file}`)];
    const data = require(`../../${file}`)
    const id = file
      .replace(SRC_FOLDER, '')
      .replace('.json', '')

    const keysToCapture = ['copy', 'text']
    let fileValues = []

    function jsonRecursive(obj) {
      for (let k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
          if (keysToCapture.indexOf(k) > -1) {
            fileValues = fileValues.concat(obj[k])
          }
          jsonRecursive(obj[k]);
        } else {
          if (keysToCapture.indexOf(k) > -1) {
            fileValues.push(obj[k])
          }
        }
      }
    }

    jsonRecursive(data.components)
    const wordCount = fileValues.join(' ').split(' ').length
    // reading time calculation https://marketingland.com/estimated-reading-times-increase-engagement-79830
    const mins = wordCount / 200
    const seconds = (mins - Math.floor(mins)) * 0.6
    const minutesRounded = Math.ceil(mins+seconds)
    // get hoi content
    // return minutesRounded

    let contentLength = {}
    contentLength.length = minutesRounded
    contentLength.unit = 'mins'

    let keyValues = Object.entries(data); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
    let componentIndex = keyValues.findIndex(el =>  el.indexOf('components') > -1)
    keyValues.splice(componentIndex, 0, ['contentLength', contentLength]); // insert key value at the index you want like 1.
    let newData = Object.fromEntries(keyValues) // convert key values to obj {key1: "value1", newKey: "newValue", key2: "value2"}
    if (index === 5) {
      console.log(wordCount, id, mins, (60 * seconds), minutesRounded)
      // console.log(keyValues)
      // console.log(keyValues.findIndex(el =>  el.indexOf('components') > -1))
      // console.log(newData)
    }

    fs.writeFileSync(file, JSON.stringify(newData, null, "\t"))

  })

}

processFiles(getFiles(), (data) => {
  // write local copy
  console.log("complete")
  // fs.writeFileSync(LOCAL_BUILD_FOLDER + '/hoi-search-local.json', JSON.stringify(data))
  // resolve(data)
})
