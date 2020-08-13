var getFilesInDirectory = require('./helpers').getFilesInDirectory
var shuffleArray = require('./helpers').shuffleArray

var SRC_FOLDER = 'src/home-of-innovation/pages/'

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
// console.log(files)


// holder for page words
var pageWords = []
const wordsToFilter = ['alt','left','right','bottom','top','kv','jpg',
'png','the','type','desktop','mobile','components','image','samsung',
'lifestyle','creativity','innovation','entertainment','is','com','images',
'https','http','www','utm','blank','campaign','style','paragraphs','wrapper',
'title','share','and','you','with','assets','headline','has','from','this','about',
'explore','your','but','could','here','being','buttons','text','description','tips',
'content','can','true','level','copy','thumb','are','background','kings','cross','home',
'media','group','dynamic','more','for','large','its','target','href','that','their','these',
'such','like','what','black','white','have','some','which','episodes','they','will','sort','also',
'gallery','sessions']

// first pass to process text and find words
files.forEach((file, index) => {

  delete require.cache[require.resolve(`../${file}`)];
  const data = require(`../${file}`)
  const id = file
    .replace(SRC_FOLDER, '')
    .replace('.json', '')

  // todo, remove links here
  let words = JSON.stringify(data)
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    // .replace(/{|}|:|\[|\]|,|\||_|-|"|'|\?|\\|\(|\)|\/|\./gi, ' ')
    .split(' ')

  words = words.filter(word => {
    if (word.length <= 3) {
      return false
    }
    if (Number.isNaN(parseInt(word)) === false) {
      return false
    }
    if (wordsToFilter.indexOf(word) > -1) {
      return false
    }
    return true
  })

  pageWords.push({
    id,
    words
  });

})
// first pass complete

//
// console.log(pageWords, pageWords.length);

var pageScores = []

// master loop, calculating scores for THIS page
pageWords.forEach((page, pageIndex) => {

  console.log('checking', page.id)

  // create array for our page scores
  page.scores = []

  // loop each page to be check
  pageWords.forEach((checkPage, checkIndex) => {

    // create array for page matches & score
    var checkPageMatches = []
    var checkPageScore = 0

    // dont check if the same page
    if (checkPage.id === page.id) {
      return
    }

    // dont check if page is in same category
    if (checkPage.id.split('|')[1] === page.id.split('|')[1]) {
      return
    }

    page.words.forEach((pageWord) => {
      // matching instances of word
      const instances = checkPage.words.filter((checkWord) => pageWord === checkWord).length
      // score the word
      const score = Math.max(instances, 5)
      // if word has already been checked
      const exists = checkPageMatches.find(m => m.word === pageWord)

      // if there are more than 1 instance & doesnt exist
      if (instances > 1 && !exists) {
        // push matches object with word and count
        checkPageMatches.push({word: pageWord, count: checkPage.words.filter((checkWord) => pageWord === checkWord).length})
        // sort the matches
        checkPageMatches = checkPageMatches.sort((a,b) => { return b.count - a.count })
        // update check page score
        checkPageScore += score
      }
    })

    // push page score object
    page.scores.push({id: checkPage.id, score: checkPageScore})//, matches: checkPageMatches})

  })


  // sort by score
  page.scores.sort((a,b) => {
    return b.score - a.score
  })

  // to make the related pages a bit more random
  // reduce to top 8 scoring pages
  page.scores = page.scores.slice(0,6)
  // shuffle the top 8
  page.scores = shuffleArray(page.scores)
  //retrim to 4 length
  page.scores = page.scores.slice(0,4)

  pageScores.push(page)
  console.log(page.scores)

})
