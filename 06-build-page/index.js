const fs = require('fs');
const path = require('path');

function cutFile(file) {
  let arr = file.split('.');
  if (arr[1] == 'html') return arr[0];
}

const rewriteIndex = (name) => {
  return new Promise((res) => {
    fs.readFile(__dirname + '/project-dist/index.html', (error, data) => {
      if (error) throw error;
      fs.readFile(__dirname + '/components/' + name, (error, value) => {
        if (error) throw error;
        let template = data.toString();
        let result = template.replace(`{{${cutFile(name)}}}`, value);
        fs.writeFile(__dirname + '/project-dist/index.html', result, (err) => {
          if (err) throw err;
          res();
        });
      });
    });
  });
};

const readComponents = () => {
  fs.readdir(__dirname + '/components', async (err, files) => {
    if (err) throw err;
    else {
      for (const file of files) {
        await rewriteIndex(file);
      }
      return;
    }
  });
};

const mergeStyle = () => {
  const bundleArray = [];
  fs.readdir(__dirname + '/styles', (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach(file => {
        if (path.extname(file) == '.css') {
          fs.readFile(__dirname + '/styles/' + file, 'utf8', function (error, fileContent) {
            if (error) throw error;
            bundleArray.push(fileContent);
            fs.open(__dirname + '/project-dist/style.css', 'w', (err) => {
              if (err) throw err;
              fs.writeFile(__dirname + '/project-dist/style.css', `${bundleArray.join('\n\n')}`, (err) => {
                if (err) throw err;
              });
            });
          });
        }
      });
    }
  });
};

const copyPath = __dirname + '/project-dist/assets';
const assetsCopy = async () => {
  fs.mkdir(copyPath, err => { if (err) throw err; });
  fs.readdir(__dirname + '/assets', { withFileTypes: true }, async (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach(file => {
        if (!file.isFile()) {
          let copyDirectory = copyPath + '/' + file.name;
          let mainDirectory = __dirname + '/assets/' + file.name;
          readDir(copyDirectory, mainDirectory);
        } else {
          makeFileCopy(file);
        }
      });
    }
  });
  function readDir(copyDirectory, mainDirectory) {
    fs.mkdir(copyDirectory, err => { if (err) throw err; });
    fs.readdir(mainDirectory, { withFileTypes: true }, ((error, files) => {
      if (error) console.log(error);
      files.forEach(file => {
        let copyDir = copyDirectory + '/' + file.name;
        let mainDir = mainDirectory + '/' + file.name;
        if (file.isFile()) {
          fs.copyFile(mainDir, copyDir, err => { if (err) throw err; });
        }
        if (!file.isFile()) {
          readDir(copyDir, mainDir);
        }
      });
    }));
  }
  function makeFileCopy(fileToCopy) {
    fs.copyFile(
      __dirname + '/assets/' + fileToCopy.name,
      __dirname + '/project-dist/assets/' + fileToCopy.name,
      err => { if (err) console.log(err); });
  }
  console.log('Building Complete');
};

const build = () => {
  fs.readFile(__dirname + '/project-dist/index.html', (error) => {
    if (error) {
      fs.mkdir(__dirname + '/project-dist', err => {
        if (err);
        fs.copyFile(__dirname + '/template.html', __dirname + '/project-dist/index.html', err => {
          if (err) throw err;
          else {
            readComponents();
            mergeStyle();
            assetsCopy();
          }
        });
      });
    } else {
      fs.rm(__dirname + '/project-dist', { recursive: true, force: true }, err => {
        if (err) console.log(err);
        build();
      });
    }
  });
};
build();