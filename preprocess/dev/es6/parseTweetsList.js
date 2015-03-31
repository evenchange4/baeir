"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project
import $sequelize from "../libs/sequelize";

// Model Schema
var Tweets = $sequelize.Tweets;
var Users = $sequelize.Users;
var Users_Tweets = $sequelize.Users_Tweets

var filePath = process.argv[2];
var lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");

  /**
  * 初始化 Tweets 列表
  *
  * @param  {string} uid
  * @return {int} text_length 
  * @return {int} url_counts
  * @return {int} retweet_counts
  *
  * @author Michael Hsu
  */
  var req1 = /@(\S){8,9}：/g;  // example: "@uMLLV3ZCO：", "@uMLLV3ZO："
  var req2 = /@ukn：/g;        // example: "@ukn："
  var req3 = /http(s)*:\/\//g; // example: "http://", "https://"

  Promise.resolve()
  .then(()=>{
    return Tweets.create({
      mid,
      retweeted_status_mid,
      uid,
      retweeted_uid,
      source,
      image: image == 1,
      text,
      text_length: text.length,
      mention_counts: (text.match(req1) || []).length + (text.match(req2) || []).length,
      url_counts: (text.match(req3) || []).length,
      geo,
      created_at: new Date(created_at).getTime() || null,
      deleted_last_seen: new Date(deleted_last_seen).getTime() || null,
      permission_denied
    });
  })
  .then(()=>{
    // console.log(d);
  })
  .catch((error)=>{
    console.log(error);
  });

});