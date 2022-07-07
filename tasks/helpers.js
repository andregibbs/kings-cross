var fs = require('fs')
var path = require('path')

function getFilesInDirectory(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)
  return files.map((file) => {
    return path.join(dirPath, "/", file)
  })
}

// https://gist.github.com/getify/3667624
function escapeDoubleQuotes(str) {
    if (typeof str !== 'string') {
      return str
    }
   return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
 }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}


module.exports = {
  getFilesInDirectory,
  shuffleArray,
  escapeDoubleQuotes
}
