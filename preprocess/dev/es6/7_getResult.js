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
  let temp = fs.readFileSync(`${filePath}/preprocess/output.rank.txt`, 'utf8');
  output = temp.split('\n');
  output.pop();
  console.log(`>> ${filePath}/preprocess/output.rank.txt done!`);
})

.then(()=> {
  let temp = fs.readFileSync(`${filePath}/README.md`, 'utf8');
  let lines = temp.split('\n');
  let nusers = lines[2].split(' ')[5];
  let ntweets = lines[3].split(' ')[5];

  for (let i = 0; i < nusers; i++) {
    array[i] = [];
    for (let j = 0; j < ntweets; j++) {
      array[i][j] = output[ntweets * i + j];
    }
  }

  console.log(`>> ${filePath}/README.md done!`);
})

.then(()=> {
  let resultArray = [];
  array.forEach((tweetList, uid)=> {
    let midArray = [];
    let valueArray = [];
    tweetList.forEach((value, index)=> {
      let mid = index + 1;
      midArray[index] = mid;
      valueArray[index] = parseFloat(value);
    });

    let sortArray = [];
    console.log(uid)
    for (let s = 0; s < 20; s++) {
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
