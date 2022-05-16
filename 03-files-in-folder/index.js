const fs = require('fs');
const directory = './03-files-in-folder/secret-folder';

function cutFile(file) {
  let arr = file.split('.');
  return arr[0] + ' - ' + arr[1];
}

fs.readdir(directory, { withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (file.isFile()) {
        let name = cutFile(file.name);
        fs.stat('./03-files-in-folder/secret-folder/' + file.name, (error, stats) => {
          if (error) console.log(error);
          else {
            console.log(name + ' - ' + stats.size + 'byte');
          }
        });
      }
    });
  }
});