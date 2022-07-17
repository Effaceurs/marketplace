const fs = require('fs');

function createDir(file){
  if (!fs.existsSync(file)){
    fs.mkdirSync(file, {recursive: true});
  }
}

function cleanUp(file){
  if (fs.existsSync(file)) {
    fs.rmdirSync('./'+file, {recursive: true});
  }
}

createDir('customer/loh')
cleanUp('customer')