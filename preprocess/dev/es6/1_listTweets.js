"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project
import $sequelize from "../libs/sequelize";

// Model Schema
var Tweets = $sequelize.Tweets;

var filePath = process.argv[2];
var lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");

  /**
  * 初始化 Tweets 列表
  *
  * @param  {string} mid, uid, ...
  *
  * @return {int} text_length 
  * @return {int} mention_counts
  * @return {int} url_counts
  * @return {date} created_at
  * @return {date} deleted_last_seen
  *
  * @author Michael Hsu
  */

  var req1 = /@(\S){8,9}：/g;  // example: "@uMLLV3ZCO：", "@uMLLV3ZO："
  var req2 = /@ukn：/g;        // example: "@ukn："
  var req3 = /http(s)*:\/\//g; // example: "http://", "https://"
  var req4 = /POINT\((.)*\)/g; // example: "POINT(121.62397 31.10708)"

  Promise.resolve()
  .then(()=>{
    return Tweets.create({
      mid,
      isRetweeted: retweeted_status_mid ? true : false,
      retweeted_status_mid,
      uid,
      retweeted_uid,
      source,
      image: image == 1,
      text,
      text_length: text.length,
      mention_counts: (text.match(req1) || []).length + (text.match(req2) || []).length,
      url_counts: (text.match(req3) || []).length,
      geo: geo.match(req4) ? geo : "",
      created_at: new Date(created_at).getTime() || null,
      deleted_last_seen: new Date(deleted_last_seen).getTime() || null,
      permission_denied
    });
  })
  .then(()=>{
    // console.log(d);
  })
  .catch((error)=>{
    if (typeof(error.errors) === 'undefined') {
      console.log({line});
      console.log(error);
    };
  });

});