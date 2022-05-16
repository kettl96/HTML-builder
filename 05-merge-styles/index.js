const fs = require('fs');
const path = require('path');

const bundleArray = [];

fs.readdir(__dirname + '/styles', (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (path.extname(file) == '.css') {
        fs.readFile(__dirname + '/styles/' + file, 'utf8', function (error, fileContent) {
          if (error) throw error;
          bundleArray.push(fileContent);
          fs.open(__dirname + '/project-dist/bundle.css', 'w', (err) => {
            if (err) throw err;
            fs.writeFile(__dirname + '/project-dist/bundle.css', `${bundleArray.join('')}`, (err) => {
              if (err) throw err;
            });
          });
        });
      }
    });
  }
  console.log('Creation bundle.css complete!');
});
