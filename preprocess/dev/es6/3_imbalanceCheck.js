"use strict";

// node_modules
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";

// Model Schema
const Tweets_Trains = $sequelize.Tweets_Trains;
const Tweets_Tests = $sequelize.Tweets_Tests;

/**
* Check imblanced Datasets
*
* @param  {Table} Tweets_Trains
* @param  {Table} Tweets_Tests
*
* @return {int} Train_Negative
* @return {int} Train_Positive
* @return {int} Test_Negative
* @return {int} Test_Positive
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  return Tweets_Trains.count({ where: { isRetweeted: true }});
})
.then((Train_Negative)=>{
  console.log({ Train_Negative});
})
.catch((error)=>{
  console.log(error);
});

Promise.resolve()
.then(()=>{
  return Tweets_Trains.count({ where: { isRetweeted: false }});
})
.then((Train_Positive)=>{
  console.log({ Train_Positive});
})
.catch((error)=>{
  console.log(error);
});

Promise.resolve()
.then(()=>{
  return Tweets_Tests.count({ where: { isRetweeted: true }});
})
.then((Test_Negative)=>{
  console.log({ Test_Negative});
})
.catch((error)=>{
  console.log(error);
});

Promise.resolve()
.then(()=>{
  return Tweets_Tests.count({ where: { isRetweeted: false }});
})
.then((Test_Positive)=>{
  console.log({ Test_Positive});
})
.catch((error)=>{
  console.log(error);
});