"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project
import $sequelize from "../libs/sequelize";

// Model Schema
var Tweets = $sequelize.Tweets;
// var Users_Tweets = $sequelize.Users_Tweets;

var filePath = process.argv[2];
var lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
    

  /**
  * 計算 retweeted_counts  被轉錄多少次
  *
  * @param  {string} retweeted_status_mid
  *
  * @return {int} retweeted_counts + 1
  *
  * @author Michael Hsu
  */

  Promise.resolve()
  .then(()=>{
    return Tweets.find({ where:{ mid: retweeted_status_mid } });
  })
  .then((tweet)=>{
    return tweet.increment({ retweeted_counts: 1 });
  })
  .catch((error)=>{
    // console.log({line});
    // console.log(error);
  });

});

