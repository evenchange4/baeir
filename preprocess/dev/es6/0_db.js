"use strict";

// self project modules
import $sequelize from "../libs/sequelize";

/**
* 同步資料庫
*
* @param  {array} [string] Table name
* @return {string} "[SYNC] Models sync Success"
*
* @author Michael Hsu
*/

// var tablesList = ["Users_Users"];
var tablesList = [
  "Tweets", 
  "Tweets_Trains", 
  "Tweets_Tests", 
  "Users", 
  "Expressions",
  "Topics",
  "Relation_Mention", 
  "Relation_Retweet",
  "Relation_Users_Tweets",
  ];

$sequelize
.sync(tablesList)
.then((msg) =>{
  console.log(msg);
});
