"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";

// Model Schema
const Relation_Users_Tweets = $sequelize.Relation_Users_Tweets;

// parse file
const filePath = process.argv[2];
const lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  let [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
  
  /**
  * 建構 Relation User / Tweet
  *
  * @param  {string} mid
  * @param  {string} uid
  *
  * @return relation
  *
  * @author Michael Hsu
  */

  Promise.resolve()
  .then(()=>{
    return Relation_Users_Tweets.create({ mid, uid });
  })
  .catch((error)=>{
    // console.log({line});
    // console.log(error);
  });

});

