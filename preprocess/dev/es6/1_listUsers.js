"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project
import $sequelize from "../libs/sequelize";

// Model Schema
var Users = $sequelize.Users;

var filePath = process.argv[2];
var lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
  
  /**
  * 初始化 Users 列表
  *
  * @param  {string} uid
  *
  * @return {int} tweet_counts: 0
  *
  * @author Michael Hsu
  */
  Promise.resolve()
  .then(()=>{
    return Users.create({ uid , tweet_counts: 0 });
  })
  .catch((error)=>{
    if (error.errors[0].message !== "uid must be unique") {
      console.log({line});
      console.log(error);
    };
  });

});

