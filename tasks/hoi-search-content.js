const path = require('path')
const fs = require('fs')
const getFilesInDirectory = require('./helpers').getFilesInDirectory
const escapeDoubleQuotes = require('./helpers').escapeDoubleQuotes
const shuffleArray = require('./helpers').shuffleArray

const SRC_FOLDER = 'src/home-of-innovation/pages/'
const PUBLIC_URL = '/uk/explore/kings-cross/'
const LOCAL_BUILD_FOLDER = path.join( __dirname, '../build/' )

var SITE = 'uk';
var SUBFOLDER = '/explore/kings-cross';

function getFiles() {
  // Get Files
  var files = getFilesInDirectory(SRC_FOLDER)
  // Filter Files
  files = files.filter(file => {
    const id = file.replace(SRC_FOLDER, '').replace('.json', '')
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
    if (getPageData(id).hidden || getPageData(id).placeholder) {
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
  const pageData = require('../' + SRC_FOLDER + path + '.json')
  return pageData
}

function processFiles(files, cb) {
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

    // this is the same function lifted from gulpfile for processing vars,
    // have copied over for use instead of abstracting to allow change node executing dirpaths
    let preparedContent = JSON.stringify(data)
    const publicUrl = '/' + SITE + SUBFOLDER + '/';
    // Regex for{{page|page-path[key]}}
    const regex = /{{(?<page>.*?)\[(?<key>.*?)\]}}/
    // Loop over matches
    while ((match = regex.exec(preparedContent)) !== null) {
      const {page, key} = match.groups;
      let value;
      // special for any special cases

      switch (key) {
        case 'url':
          // if url we want to construct it (not avaliable in page config file)
          value = publicUrl + page.split('|').join('/')
          break;
        default:
          // otherwise get data then key
          // escaping quotes that were pr eviously escaped
          value = getPageData(page)[key]
          value = value ? escapeDoubleQuotes(value) : value

      }
      // update preparedContent, replacing the first (current) matched occurence using matched string
      preparedContent = preparedContent.replace(match[0], value)
    }
    preparedContent = JSON.parse(preparedContent)

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
      title: preparedContent.title,
      description: preparedContent.description,
      image: preparedContent.thumb,
      category: id.split('|')[0],
      url: PUBLIC_URL + id.replace(/\|/g,'/'),
      values: fileValues,
      // joinedValues: fileValues.join(), // unused
      meta: preparedContent.meta || false
    })

  })

  cb(pageData)
}

function HoiSearchContent() {
  return new Promise(function(resolve, reject) {
    processFiles(getFiles(), (data) => {
      // write local copy
      console.log("HOI Search Content Written")
      fs.writeFileSync(LOCAL_BUILD_FOLDER + '/hoi-search-local.json', JSON.stringify(data))
      resolve(data)
    })
  });
}

module.exports = HoiSearchContent
