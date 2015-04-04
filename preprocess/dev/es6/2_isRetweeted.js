"use strict";

// node_modules
import Promise from "bluebird";
require("babel/register");

// self project modules
import $sequelize from "../libs/sequelize";

// Model Schema
const Tweets_Trains = $sequelize.Tweets_Trains;
const Tweets_Tests = $sequelize.Tweets_Tests;

/**
* 1. 是否被轉錄過 isRetweeted
* 1. 計算 retweeted_counts  被轉錄多少次
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  
  /**
  * 找出所有 retweeted_status_mid 
  *
  * @author Michael Hsu
  */

  return Tweets_Trains.findAll({
    where: { }, 
    attributes:[ "mid", "retweeted_status_mid", "retweeted_counts" ] 
  });
})
.then((tweets)=>{

  /**
  * 塞進 DB 前先做比較處理，減少 requests
  *
  * @author Michael Hsu
  */

  console.log(">> Processing training datasets...");
  console.log(`number = ${tweets.length}`);

  // Setup two list
  let midList = [];
  let retweeted_status_midList = [];

  tweets.forEach((tweet) => {
    midList.push(tweet.mid);
    retweeted_status_midList.push(tweet.retweeted_status_mid);
  });

  // two list intersection
  let resultsObj = new Map();

  midList.forEach((mid) => {
    retweeted_status_midList.forEach((retweeted_status_mid) => {
      if (mid === retweeted_status_mid){
        if(!resultsObj.has(retweeted_status_mid)) {
          resultsObj.set(retweeted_status_mid, 1);
        }
        else{
          resultsObj.set(retweeted_status_mid, resultsObj.get(retweeted_status_mid) + 1);
        }
      }
    });
  });

  // example : { results: { mRsOcOLTlc: 2, mH44qG6iUm: 1 } }
  let resultList = [];
  resultsObj.forEach((retweeted_counts, retweeted_status_mid)=>{
    resultList.push({retweeted_status_mid, retweeted_counts});
  });
  return resultList;
})
.map((data)=>{

  /**
  * 是否被轉錄過 isRetweeted
  * 計算 retweeted_counts  被轉錄多少次
  *
  * @param  {string} retweeted_status_mid
  *
  * @return {Boolean} isRetweeted = true
  * @return {int} retweeted_counts + 1
  *
  * @author Michael Hsu
  */

  let {retweeted_status_mid, retweeted_counts} = data

  Tweets_Trains.update(
    { isRetweeted: true, retweeted_counts }, 
    { where: {  mid: retweeted_status_mid } }
  )
  .catch((error)=>{
    console.log(error);
  });

})
.then(()=>{
  console.log(">> Training end (async function processing...)");
})
.catch((error)=>{
  console.log(error);
})
.then(()=>{
  
  /**
  * 找出所有 retweeted_status_mid 
  *
  * @author Michael Hsu
  */

  return Tweets_Tests.findAll({
    where: { }, 
    attributes:[ "mid", "retweeted_status_mid", "retweeted_counts" ] 
  });
})
.then((tweets)=>{

  /**
  * 塞進 DB 前先做比較處理，減少 requests
  *
  * @author Michael Hsu
  */

  console.log(">> Processing testing datasets...");
  console.log(`number = ${tweets.length}`);

  // Setup two list
  let midList = [];
  let retweeted_status_midList = [];

  tweets.forEach((tweet) => {
    midList.push(tweet.mid);
    retweeted_status_midList.push(tweet.retweeted_status_mid);
  });

  // two list intersection
  let resultsObj = new Map();

  midList.forEach((mid) => {
    retweeted_status_midList.forEach((retweeted_status_mid) => {
      if (mid === retweeted_status_mid){
        if(!resultsObj.has(retweeted_status_mid)) {
          resultsObj.set(retweeted_status_mid, 1);
        }
        else{
          resultsObj.set(retweeted_status_mid, resultsObj.get(retweeted_status_mid) + 1);
        }
      }
    });
  });

  // example : { results: { mRsOcOLTlc: 2, mH44qG6iUm: 1 } }
  let resultList = [];
  resultsObj.forEach((retweeted_counts, retweeted_status_mid)=>{
    resultList.push({retweeted_status_mid, retweeted_counts});
  });
  return resultList;
})
.map((data)=>{

  /**
  * 是否被轉錄過 isRetweeted
  * 計算 retweeted_counts  被轉錄多少次
  *
  * @param  {string} retweeted_status_mid
  *
  * @return {Boolean} isRetweeted = true
  * @return {int} retweeted_counts + 1
  *
  * @author Michael Hsu
  */

  let {retweeted_status_mid, retweeted_counts} = data

  Tweets_Tests.update(
    { isRetweeted: true, retweeted_counts }, 
    { where: {  mid: retweeted_status_mid } }
  )
  .catch((error)=>{
    console.log(error);
  });

})
.then(()=>{
  console.log(">> Testing end (async function processing...)");
})
.catch((error)=>{
  console.log(error);
});
