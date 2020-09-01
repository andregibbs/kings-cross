const path = require('path')
const fs = require('fs')
const getFilesInDirectory = require('./helpers').getFilesInDirectory
const shuffleArray = require('./helpers').shuffleArray

const SRC_FOLDER = 'src/home-of-innovation/pages/'
const PUBLIC_URL = '/uk/explore/kings-cross/'
const LOCAL_BUILD_FOLDER = path.join( __dirname, '../build/' )

// Get Files
var files = getFilesInDirectory(SRC_FOLDER)
// Filter Files
files = files.filter(file => {
  const id = file.replace(SRC_FOLDER, '').replace('.json', '')
  if (file.indexOf('/_') > - 1) {
    return false
  }
  if (id.split('|')[0] === 'components') {
    return false
  }
  if (id.split('|').length <= 1) {
    return false
  }
  return true
})


let pageData = []

// first pass to process text and find words
files.forEach((file, index) => {

  delete require.cache[require.resolve(`../${file}`)];
  const data = require(`../${file}`)
  const id = file
    .replace(SRC_FOLDER, '')
    .replace('.json', '')

  const keysToCapture = ['alt', 'copy', 'credit', 'title', 'description', 'text']

  let fileValues = []
  let elementRegex = /(<.*?>)/gim
  let variableRegex = /({{.*?}})/g

  // stringify, remove vars, parse json
  let preparedContent = JSON.parse(
    JSON.stringify(data)
      .replace(variableRegex, '')
  )

  // remove element tags from string
  function removeElements(string) {
    return string.replace(elementRegex,'')
  }

  function jsonRecursive(obj) {
    for (let k in obj) {
      if (typeof obj[k] == "object" && obj[k] !== null) {
        if (keysToCapture.indexOf(k) > -1) {
          // if array, loop through and remove any elements
          let elementsRemoved = obj[k].map(removeElements)
          fileValues = fileValues.concat(elementsRemoved)
        }
        jsonRecursive(obj[k]);
      } else {
        if (keysToCapture.indexOf(k) > -1) {
          fileValues.push(removeElements(obj[k]))
        }
      }
    }
  }

  // trigger recursive loop
  jsonRecursive(preparedContent)

  // push processed fileValues to pageData
  pageData.push({
    id,
    title: data.title,
    description: data.description,
    image: data.image,
    url: PUBLIC_URL + id.replace(/\|/g,'/'),
    values: fileValues,
    joinedValues: fileValues.join()
  })

})


console.log('file written', LOCAL_BUILD_FOLDER)
fs.writeFileSync(LOCAL_BUILD_FOLDER + 'uk/explore/kings-cross/hoi-search.json', JSON.stringify(pageData))
