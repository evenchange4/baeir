import Promise from 'bluebird';
import console from 'gulp-util';
import Path from 'path';
import mkdirp from 'mkdirp';
import moment from 'moment';
import LineByLineReader from 'line-by-line';
let fs = Promise.promisifyAll(require('fs'));

// parse file
const filePath = process.argv[2];
const outputPath = Path.dirname(filePath);
const lr = new LineByLineReader(filePath, {skipEmptyLines: true });

Promise.resolve()
.then(()=> {
  return new Promise((resolve, reject)=> {
    let array = [];

    lr.on('line', (line) => {
      let [uid, mid, value] = line.split(' ');

      if (typeof (array[uid]) === 'undefined') {
        array[uid] = [];
      }

      array[uid].push(mid);
    });

    lr.on('end', ()=> {
      resolve(array);
    });
  });
})

.then((users)=> {
  let result = '';
  users.forEach((tweets)=> {
    let line = tweets.sort(function(a, b) {return a - b}).reduce((total, mid)=> {
      return `${total} ${mid}`
    });

    result = `${result}${line}\n`
  });

  return fs.writeFileAsync(`${outputPath}/answer.txt`, result);
})

.catch((error)=> {
  console.log(error);
});
