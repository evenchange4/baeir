"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";
import console from "gulp-util";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $regex from "../libs/regex";

// Model Schema
const Tweets = $sequelize.Tweets;

// parse file
const filePath = process.argv[2];
const date = process.argv[3];
const lr = new LineByLineReader(filePath, {skipEmptyLines: true });

// Separate Date
const Start = new Date(`2012-12-${date} 00:00:00`).getTime();
const End =   new Date(`2012-12-${date} 23:59:59`).getTime();

lr.on("line", (line) => {
  let [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text = "", geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");

  /**
  * 初始化 Training / Testing Datasets 列表
  *
  * @param  each line of csv file
  *
  * @return {int} text_length 
  * @return {int} mention_counts
  * @return {int} url_counts
  * @return {int} expression_counts
  * @return {int} topic_counts
  * @return {date} created_at
  * @return {date} deleted_last_seen
  *
  * @author Michael Hsu
  */

  let expressionList = text.match($regex.expression) || [];
  let topicList = text.match($regex.topic) || [];
  created_at = new Date(created_at).getTime() || null;


  Promise.resolve()
  .then(()=>{
    if ((created_at >= Start) && (created_at <= End)) {
      return Tweets.create({
        mid,
        isOriginal: retweeted_status_mid ? false : true,
        retweeted_status_mid,
        uid,
        retweeted_uid,
        source,
        image: image == 1,
        text,
        text_length: text.length,
        mention_counts: (text.match($regex.mention) || []).length + (text.match($regex.mentionUkn) || []).length,
        url_counts: (text.match($regex.url) || []).length,
        expression_counts: expressionList.length,
        topic_counts: topicList.length,
        geo: geo.match($regex.geo) ? geo : "",
        isgeo: geo.match($regex.geo) ? true : false,
        created_at,
        deleted_last_seen: new Date(deleted_last_seen).getTime() || null,
        permission_denied
      });
    }
  })
  .catch((error)=>{
    // if (typeof(error.errors) === 'undefined') {
    // console.log({line});
    console.log(error);
    // };
  });

});