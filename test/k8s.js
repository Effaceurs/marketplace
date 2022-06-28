const {readFile, writeFile, promises: fsPromises} = require('fs');


readFile('./nginx.yaml', 'utf-8', function (err, contents) {
  if (err) {
    console.log(err);
    return;
  }
  
  const replaced = contents.replace(/name: nginx/g, `name: MYAPP`);
  const replaced2 = replaced.replace(/app: nginx/g, `app: MYAPP`);
  writeFile('./example.yaml', replaced2, 'utf-8', function (err) {
    console.log(err);
  });
}
)