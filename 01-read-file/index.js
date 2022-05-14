let fs = require('fs');
let data = '';
let readerStream = fs.createReadStream('./01-read-file/text.txt');
readerStream.setEncoding('UTF8');
readerStream.on('data', function(chunk){
  data += chunk;
  console.log(data);
});
readerStream.on('error', function(err){
  console.log(err.stack);
});
