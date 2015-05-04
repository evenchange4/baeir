import Promise from 'bluebird';
import console from 'gulp-util';
import Path from 'path';
import mkdirp from 'mkdirp';
import moment from 'moment';
import LineByLineReader from 'line-by-line';
let fs = Promise.promisifyAll(require('fs'));

// parse file
const filePath = process.argv[2];

let output = [];
let array = [];

Promise.resolve()
.then(()=> {
  return new Promise((resolve, reject)=> {
    const lr = new LineByLineReader(`${filePath}/preprocess/output.rank.txt`, {skipEmptyLines: true });

    lr.on('line', (line) => {
      let value = line;
      output.push(value);
    });

    lr.on('end', ()=> {
      resolve('done output');
    });
  });
})

.then(()=> {
  return new Promise((resolve, reject)=> {
    const lr = new LineByLineReader(`${filePath}/preprocess/test.rank.list.txt`, {skipEmptyLines: true });
    let index = 0;
    lr.on('line', (line) => {
      let [uid, mid, value] = line.split(' ');
      value = output[index];

      if (typeof (array[uid]) === 'undefined') {
        array[uid] = new Map();
      }

      array[uid].set(mid, value);
      index = index + 1;
    });

    lr.on('end', ()=> {
      resolve('done test');
    });
  });
})

.then(()=> {
  let resultArray = [];
  array.forEach((tweetMap, uid)=> {
    let midArray = [];
    let valueArray = [];
    tweetMap.forEach((value, mid)=> {
      midArray.push(mid);
      valueArray.push(parseFloat(value));
    });

    let sortArray = [];
    let size = tweetMap.size;
    for (let s = 0; s < size; s++) {
      let max = Math.max(...valueArray);
      let maxIndex = valueArray.indexOf(max);
      let maxMid = midArray[maxIndex];

      sortArray.push(maxMid);
      midArray.splice(maxIndex, 1);
      valueArray.splice(maxIndex, 1);
    }

    resultArray.push(sortArray);
  });

  return resultArray;
})

.then((resultArray)=> {
  let result = '';

  resultArray.forEach((mids)=> {
    let line = mids.reduce((total, mid)=> {
      return `${total} ${mid}`
    });

    result = `${result}${line}\n`
  });

  return fs.writeFileAsync(`${filePath}/preprocess/result.txt`, result);
})

.catch((error)=> {
  console.log(error);
});
