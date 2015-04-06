"use strict";

// node_modules
import Promise from "bluebird";
import console from "gulp-util";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $sql from "../libs/sql";
import * as $feature from "../libs/extractTweetFeatures";
import $params from "../../configs/parameters.json";

// Model Schema
const Expressions = $sequelize.Expressions;
const Topics = $sequelize.Topics;
const Relation_Users_Tweets = $sequelize.Relation_Users_Tweets;
const Users = $sequelize.Users;
const Relation_Users_Users = $sequelize.Relation_Users_Users;
const tablesList = [
  "Users", 
  "Tweets_Trains", 
  "Tweets_Tests", 
  "Expressions",
  "Topics",
  "Relation_Users_Users", 
  "Relation_Users_Tweets",
  ];

/**
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  // 1. 清掉資料庫
  return $sequelize.sync(tablesList);
})
.then((msg)=>{
  console.log(msg);
})
.then(()=>{
  // 2. aggregate By Users，找出所有受訪者的 Tweets
  return $sequelize.sequelize.query($sql.aggregateByUsers, null, { raw: true } );
})
.then((data)=>{
  // 3. 篩選出前 4/5 為 Training Datasets
  let trainsList = data[0];
  let testsList = [];
  let start = Number.parseInt(data[1].rowCount * $params.percentageOfTrainSet);
  let end = data[1].rowCount;

  for (let i = start; i <= end; i++) {
    testsList.push(trainsList.pop());
  }

  console.log(`
    >> number of tweets = ${data[1].rowCount}
    >> (Trains, Tests) = (${trainsList.length}, ${testsList.length})
  `);

  return {trainsList, testsList};
})
.then((tweets)=>{
  // 4. Extract feature from raw tweets
  return $feature.extract(tweets);
})
.then((data)=>{
  // 5. 打到資料庫
  return new Promise((resolve, reject) => {
    Promise.resolve()
    .then(()=>{
      console.log(">> start Expressions ...");
      return Expressions.bulkCreate(data.expressionResults);
    })
    .then(()=>{
      console.log(">> start Topics ...");
      return Topics.bulkCreate(data.topicResults);
    })
    .then(()=>{
      console.log(">> start Relation_Users_Tweets ...");
      return Relation_Users_Tweets.bulkCreate(data.relationList);
    })
    .then(()=>{
      console.log(">> start Users ...");
      return Users.bulkCreate(data.userResults);
    })
    .then(()=>{
      console.log(">> start Relation_Users_Users ...");
      return Relation_Users_Users.bulkCreate(data.relation_UsersResults);
    })
    .then(()=>{
      resolve("Finished.");
    })
    .catch((error)=>{
      reject(error);
    });
  });

})
.then(()=>{
  console.log(">> Start async function processing ...");
})
.catch((error)=>{
  console.log(error);
});