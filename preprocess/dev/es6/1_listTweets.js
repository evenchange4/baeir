"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $regex from "../libs/regex";

// Model Schema
const Tweets = $sequelize.Tweets;
const Expressions = $sequelize.Expressions;
const Topics = $sequelize.Topics;

// parse file
const filePath = process.argv[2];
const lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  let [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");

  /**
  * 初始化 Tweets 列表
  *
  * @param  line
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

  Promise.resolve()
  .then(()=>{
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
      created_at: new Date(created_at).getTime() || null,
      deleted_last_seen: new Date(deleted_last_seen).getTime() || null,
      permission_denied
    });
  })
  .catch((error)=>{
    // if (typeof(error.errors) === 'undefined') {
    // console.log({line});
    // console.log(error);
    // };
  });

  /**
  * 初始化 Expressions 列表
  *
  * @param  {array} expressionList
  *
  * @return {int} tweet_counts 
  * @return {int} retweet_counts
  *
  * @author Michael Hsu
  */

  Promise.resolve(expressionList)
  .map((expression)=>{
    return Expressions.findOrCreate({ 
      where:{ 
        expression: expression.replace(/\[|\]/g,"")
      } 
    });
  })
  .map((expression)=>{
    return expression[0].increment({ 
      tweet_counts: retweeted_status_mid ? 1 : 0,
      retweet_counts: retweeted_status_mid ? 0 : 1
    });
  })
  .catch((error)=>{
    // console.log({line});
    // console.log(error);
  });

  /**
  * 初始化 Topics 列表
  *
  * @param  {array} topicList
  *
  * @return {int} tweet_counts 
  * @return {int} retweet_counts
  *
  * @author Michael Hsu
  */
  
  Promise.resolve(topicList)
  .map((topic)=>{
    return Topics.findOrCreate({ 
      where:{ 
        topic: topic.replace(/#/g,"")
      } 
    });
  })
  .map((topic)=>{
    return topic[0].increment({ 
      tweet_counts: retweeted_status_mid ? 1 : 0,
      retweet_counts: retweeted_status_mid ? 0 : 1
    });
  })
  .catch((error)=>{
    // console.log({line});
    // console.log(error);
  });

});