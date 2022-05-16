let output = require('fs');
let writerStream = output.createWriteStream('./02-write-file/text.txt');
const { stdin, stdout } = process;
stdout.write('Enter message\n');
stdin.on('data', data => {
  const dataArr = data.toString().split('');
  const dataString = dataArr.slice(0, dataArr.length - 2).join('');
  dataString === 'exit' ? process.exit():  writerStream.write(data);
});
process.on('exit', () => stdout.write('Good luck!'));