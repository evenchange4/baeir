"use strict";

// self project modules
import $sequelize from "../libs/sequelize";
import console from "gulp-util";
/**
* 同步資料庫
*
* @param  {array} [string] Table name
* @return {string} "[SYNC] Models sync Success"
*
* @author Michael Hsu
*/

const tablesList = [
  "Tweets", 
  "Users", 
  "Expressions",
  "Topics",
  "Relation_Users_Users", 
  "Relation_Users_Tweets",
  ];

$sequelize
.sync(tablesList)
.then((msg) =>{
  console.log(msg);
})
.catch((error)=>{
  console.log(error);
});
