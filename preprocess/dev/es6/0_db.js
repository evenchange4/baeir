"use strict";

// self project
import $sequelize from "../libs/sequelize";
import $configs from "../../configs.json";

/**
* 同步資料庫
*
* @param  {array} [string] Table name
* @return {string} "[SYNC] Models sync Success"
*
* @author Michael Hsu
*/

var tablesList = ["Tweets", "Users", "Users_Tweets"];

$sequelize
.sync(tablesList)
.then((msg) =>{
  console.log(msg);
});
