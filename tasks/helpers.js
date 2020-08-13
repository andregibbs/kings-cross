var fs = require('fs')
var path = require('path')

function getFilesInDirectory(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)
  return files.map((file) => {
    return path.join(dirPath, "/", file)
  })
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
  shuffleArray
}
