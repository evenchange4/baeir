"use strict";

// node_modules
import Promise from "bluebird";
import console from "gulp-util";

// self project modules
import $sequelize from "../libs/sequelize";

// Model Schema
const Tweets = $sequelize.Tweets;

/**
* Check imblanced Datasets
*
* @param  {Table} Tweets
*
* @return {int} Train_Negative
* @return {int} Train_Positive
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  return Tweets.count({ where: { isRetweeted: false }});
})
.then((Train_Negative)=>{
  console.log({Train_Negative});
})
.then(()=>{
  return Tweets.count({ where: { isRetweeted: true }});
})
.then((Train_Positive)=>{
  console.log({Train_Positive});
})
.catch((error)=>{
  console.log(error);
});
