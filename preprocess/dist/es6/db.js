"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

// self project

var $sequelize = _interopRequire(require("../libs/sequelize"));

var $configs = _interopRequire(require("../../configs.json"));

/**
* 同步資料庫
*
* @param  {array} [string] Table name
* @return {string} "[SYNC] Models sync Success"
*
* @author Michael Hsu
*/

var tablesList = ["Tweets", "Users", "Users_Tweets"];

$sequelize.sync(tablesList).then(function (msg) {
  console.log(msg);
});