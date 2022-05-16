const fs = require('fs');
const p = require('path');

let path = p.join(__dirname, './files-copy');

function deleteFile() {
  return new Promise((res) => {    
    fs.readdir(path, (err, files) => {
      if (err) console.log(err);
      if (files.length == 0) res();
      for (let file of files) {
        fs.unlink(path + '/' + file, (err => {
          if (err) throw err;
          res();
        }));
      }
    });
  });
}

fs.mkdir(path, { recursive: true }, err => {
  if (err) throw err;
});
fs.readdir('./04-copy-directory/files', async (err, files) => {
  if (err) console.log(err);
  else {
    await deleteFile();

    files.forEach(file => {
      fs.copyFile('./04-copy-directory/files/' + file, './04-copy-directory/files-copy/' + file, err => {
        if (err) throw err;
      });
    });
    console.log('Copying complete');
  }
});
