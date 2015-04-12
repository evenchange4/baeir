"use strict";

// node_modules
import Promise from "bluebird";
// import console from "gulp-util";
import Path from "path";
import _ from "underscore";
let fs = Promise.promisifyAll(require("fs"));

// self project modules
import $topK from "../libs/topK";

// input two file
const answersFilePath = Path.join(__dirname, process.argv[2]);
const resultsFilePath = Path.join(__dirname, process.argv[3]);
const K = process.argv[4];

// variable
let answer = [];
let result = [];

Promise.resolve()
.then(()=>{
  return fs.readFileAsync(answersFilePath, 'utf8');
})
.then((data)=>{
  answer = $topK(data, K);
})
.then(()=>{
  return fs.readFileAsync(resultsFilePath, 'utf8');
})
.then((data)=>{
  result = $topK(data, K);
})
.then(()=>{
  console.log({answer: answer.length, result: result.length});

  for(let i = 0; i < answer.length; i++){
    let intersection = _.intersection(answer[i], result[i]);
    console.log({i})
    console.log({answer: answer[i]});
    console.log({result: result[i]});
    console.log({intersection});
    console.log({AP: intersection.length / K});
    console.log('\n');
  }
})
.catch((error)=>{
  console.log(error);
})
