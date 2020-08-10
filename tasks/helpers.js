var fs = require('fs')
var path = require('path')

export function getFilesInDirectory(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)
  return files.map((file) => {
    return path.join(dirPath, "/", file)
  })
}
