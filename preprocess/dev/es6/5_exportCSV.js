"use strict";

// node_modules
import Promise from "bluebird";
require("babel/register");
import console from "gulp-util";
// import fs from "fs";
let fs = Promise.promisifyAll(require("fs"));

// self project modules
import $sequelize from "../libs/sequelize";
import * as $sql from "../libs/sql";
import $params from "../../configs/parameters.json";

// Model Schema

// Output result
// const usersSetFile = fs.createWriteStream('../../data/output/users.txt');
// const tweetsSetFile = fs.createWriteStream('../../data/output/tweets.txt');
// const relationsSetFile = fs.createWriteStream('../../data/output/relations.csv');

let relationsSet = new Set();
let usersSet = new Set;
let tweetsSet = new Set;

Promise.resolve()
.then(()=>{
  // 1. 清掉資料庫
  return $sequelize.sequelize.query($sql.Relation_Users_Retweets, null, { raw: true } );
})
.then((data)=>{
  let relations = data[0];
  return relations;
})
.each((relation)=>{
  usersSet.add(relation.uid);
  tweetsSet.add(relation.retweeted_status_mid);
  relationsSet.add(`${relation.uid}_${relation.retweeted_status_mid}`);
})
.then(()=>{
  console.log(`>> # Users = ${usersSet.size}`);
  console.log(`>> # Tweets = ${tweetsSet.size}`);
  console.log(`>> # Relations = ${relationsSet.size}`);
})
.then(()=>{
  let usersResult = "";

  usersSet.forEach((u)=>{
    usersResult = `${usersResult}${u}\n`;
  });

  return fs.writeFileAsync(`${__dirname}/../../data/output/users.txt`, usersResult);
})
.then(()=>{
  console.log('>> Output file to data/output/users.txt');

  let tweetsResult = "";

  tweetsSet.forEach((t)=>{
    tweetsResult = `${tweetsResult}${t}\n`;
  });

  return fs.writeFileAsync(`${__dirname}/../../data/output/tweets.txt`, tweetsResult);
})
.then(()=>{
  console.log('>> Output file to data/output/tweets.txt');

  let trelationsResult = "";
  usersSet.forEach((u)=>{
    tweetsSet.forEach((t)=>{
      if (relationsSet.has(`${u}_${t}`)){
        trelationsResult = `${trelationsResult}1,`
      }
      else{
        trelationsResult = `${trelationsResult}0,`
      }
    });
    trelationsResult = trelationsResult.slice(0, - 1);  //去掉最後一個逗號
    trelationsResult = `${trelationsResult}\n`
  });
  return fs.writeFileAsync(`${__dirname}/../../data/output/relations.csv`, trelationsResult);
})
.then(()=>{
  console.log('>> Output file to data/output/relations.csv');
})
.catch((error)=>{
  console.log({error});
});