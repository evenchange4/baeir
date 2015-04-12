"use strict";

// node_modules
import Promise from "bluebird";
require("babel/register");
import console from "gulp-util";
import Path from "path";
let fs = Promise.promisifyAll(require("fs"));

// self project modules
import $sequelize from "../libs/sequelize";
import * as $sql from "../libs/sql";
import * as $format from "../libs/format";
import $params from "../../configs/parameters.json";

// variable
const path = Path.join(__dirname, '/../../data/output');
let relationsMap = new Map();
let usersSet = new Set;
let tweetsSet = new Set;

Promise.resolve()
.then(()=>{
  return $sequelize.sequelize.query($sql.Relation_Users_Retweets, null, { raw: true } );
})
.then((data)=>{
  let relations = data[0];
  return relations;
})
.each((relation)=>{
  usersSet.add(relation.uid);
  tweetsSet.add(relation.retweeted_status_mid);

  relationsMap.set(
    `${relation.uid}_${relation.retweeted_status_mid}`, 
    $format.toSec(relation.reponse_time)
  );
})
.then(()=>{
  let totalReport = "";

  console.log(`>> # userHasMoreThan_Tweets = ${$params.userHasMoreThan_Tweets}`);
  console.log(`>> # tweetHasBeenRetweetedMoreThan_Uwers = ${$params.tweetHasBeenRetweetedMoreThan_Uwers}`)

  console.log(`>> # Users = ${usersSet.size}`);
  console.log(`>> # Tweets = ${tweetsSet.size}`);
  console.log(`>> # Relations = ${relationsMap.size}`);

  totalReport = `${totalReport} >> # userHasMoreThan_Tweets = ${$params.userHasMoreThan_Tweets} \n`;
  totalReport = `${totalReport} >> # tweetHasBeenRetweetedMoreThan_Uwers = ${$params.tweetHasBeenRetweetedMoreThan_Uwers} \n`;
  totalReport = `${totalReport} >> # Users = ${usersSet.size} \n`;
  totalReport = `${totalReport} >> # Tweets = ${tweetsSet.size} \n`;
  totalReport = `${totalReport} >> # Relations = ${relationsMap.size} \n`;

  fs.writeFileAsync(`${path}/README.txt`, totalReport);
})
.then(()=>{
  let usersResult = "";

  usersSet.forEach((u)=>{
    usersResult = `${usersResult}${u}\n`;
  });

  return fs.writeFileAsync(`${path}/users.txt`, usersResult);
})
.then(()=>{
  console.log(`>> Output file to ${path}/users.txt`);

  let tweetsResult = "";

  tweetsSet.forEach((t)=>{
    tweetsResult = `${tweetsResult}${t}\n`;
  });

  return fs.writeFileAsync(`${path}/tweets.txt`, tweetsResult);
})
.then(()=>{
  console.log(`>> Output file to ${path}/tweets.txt`);

  let trelationsResult = "";
  usersSet.forEach((u)=>{
    tweetsSet.forEach((t)=>{
      if (relationsMap.has(`${u}_${t}`)){
        trelationsResult = `${trelationsResult}${1/relationsMap.get(`${u}_${t}`)},`
      }
      else{
        trelationsResult = `${trelationsResult}0,`
      }
    });
    trelationsResult = trelationsResult.slice(0, - 1);  //去掉最後一個逗號
    trelationsResult = `${trelationsResult}\n`
  });
  return fs.writeFileAsync(`${path}/relations.csv`, trelationsResult);
})
.then(()=>{
  console.log(`>> Output file to ${path}/relations.csv`);
})
.catch((error)=>{
  console.log({error});
});