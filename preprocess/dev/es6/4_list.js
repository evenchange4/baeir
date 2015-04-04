"use strict";

// node_modules
import Promise from "bluebird";
require("babel/register");

// self project modules
import $sequelize from "../libs/sequelize";
import * as $regex from "../libs/regex";

// Model Schema
const Tweets_Trains = $sequelize.Tweets_Trains;
const Expressions = $sequelize.Expressions;
const Topics = $sequelize.Topics;
const Relation_Users_Tweets = $sequelize.Relation_Users_Tweets;
const Users = $sequelize.Users;

/**
* 1. 初始化 Expressions 列表
* 2. 初始化 Topics 列表
* 3. 建構 Relation between User and Tweet
* 4. 初始化 Users 列表

* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  return Tweets_Trains.findAll({
    where: {}, 
    attributes:[ "mid", "uid", "text", "isRetweeted", "retweeted_counts", "isOriginal", "isgeo" ] 
  });
})
.then((tweets)=>{

  let expressionMap = new Map();
  let topicMap = new Map();
  let relationList = [];
  let userMap = new Map();

  // for each tweet loop
  console.log(">> For each tweet loop ...");
  
  tweets.forEach((tweet)=>{
    let { mid, uid, text, isRetweeted, retweeted_counts, isOriginal, isgeo } = tweet;
    
    relationList.push({ mid, uid });

    let expressionList = text.match($regex.expression) || [];
    let topicList = text.match($regex.topic) || [];
    let mentionList = text.match($regex.mention) || [];
    let mentionListUkn = text.match($regex.mentionUkn) || [];
    let urlList = text.match($regex.url) || [];

    if(!userMap.has(uid)) {
      userMap.set(uid, {
        tweet_counts: isOriginal ? 1 : 0,
        retweet_counts: isOriginal ? 0 : 1,
        mention_counts: mentionList.length + mentionListUkn.length,
        url_counts: urlList.length,
        expression_counts: expressionList.length,
        topic_counts: topicList.length,
        geo_counts: isgeo ? 1 : 0 
      });
    }
    else{
      userMap.set(uid, {
        tweet_counts: userMap.get(uid).tweet_counts + isOriginal ? 1 : 0,
        retweet_counts: userMap.get(uid).retweet_counts + isOriginal ? 0 : 1,
        mention_counts: userMap.get(uid).mention_counts + mentionList.length + mentionListUkn.length,
        url_counts: userMap.get(uid).url_counts + urlList.length,
        expression_counts: userMap.get(uid).expression_counts + expressionList.length,
        topic_counts: userMap.get(uid).topic_counts + topicList.length,
        geo_counts: userMap.get(uid).geo_counts + isgeo ? 1 : 0 
      });
    }


    topicList.forEach((topic) => {
      topic = topic.replace(/#/g,"");
      if(!topicMap.has(topic)) {
        topicMap.set(topic, { 
          retweeted_counts,
          nonretweeted_counts: isRetweeted ? 0 : 1
        });
      }
      else{
        if(isRetweeted){
          topicMap.set(topic, { 
            retweeted_counts: topicMap.get(topic).retweeted_counts + retweeted_counts,
            nonretweeted_counts: topicMap.get(topic).nonretweeted_counts + 0
          });
        }
        else{
          topicMap.set(topic, { 
            retweeted_counts: topicMap.get(topic).retweeted_counts + retweeted_counts,
            nonretweeted_counts: topicMap.get(topic).nonretweeted_counts + 1
          });
        }
      }
    });

    expressionList.forEach((expression) => {
      expression = expression.replace(/\[|\]/g,"");
      if(!expressionMap.has(expression)) {
        expressionMap.set(expression, { 
          retweeted_counts,
          nonretweeted_counts: isRetweeted ? 0 : 1
        });
      }
      else{
        if(isRetweeted){
          expressionMap.set(expression, { 
            retweeted_counts: expressionMap.get(expression).retweeted_counts + retweeted_counts,
            nonretweeted_counts: expressionMap.get(expression).nonretweeted_counts + 0
          });
        }
        else{
          expressionMap.set(expression, { 
            retweeted_counts: expressionMap.get(expression).retweeted_counts + retweeted_counts,
            nonretweeted_counts: expressionMap.get(expression).nonretweeted_counts + 1
          });
        }
      }
    });
  });
  
  // results formating
  console.log(">> Results formating ...");

  let expressionResults = [];
  let topicResults = [];
  let userResults = [];

  expressionMap.forEach((value, key)=>{
    expressionResults.push({ 
      expression: key,
      retweeted_counts: value.retweeted_counts,
      nonretweeted_counts: value.nonretweeted_counts
    });
  });

  topicMap.forEach((value, key)=>{
    topicResults.push({ 
      topic: key,
      retweeted_counts: value.retweeted_counts,
      nonretweeted_counts: value.nonretweeted_counts
    });
  });

  userMap.forEach((value, key)=>{
    userResults.push({ 
      uid: key,
      tweet_counts: value.tweet_counts,
      retweet_counts: value.retweet_counts,
      mention_counts: value.mention_counts,
      url_counts: value.url_counts,
      expression_counts: value.expression_counts,
      topic_counts: value.topic_counts,
      geo_counts: value.geo_counts,
    });
  });

  return {
    expressionResults, 
    topicResults,
    userResults,
    relationList
  };
})
.then((data)=>{

  /**
  * 初始化 Expressions 列表
  * 初始化 Topics 列表
  *
  * @param  {array} expressionList
  * @param  {array} topicList
  *
  * @return {int} tweet_counts 
  * @return {int} retweet_counts
  *
  * @author Michael Hsu
  */

  Expressions.bulkCreate(data.expressionResults)
  .catch((error)=>{
    console.log(error);
  });

  Topics.bulkCreate(data.topicResults)
  .catch((error)=>{
    console.log(error);
  });

  /**
  * 建構 Relation between User and Tweet
  *
  * @param  {string} mid
  * @param  {string} uid
  *
  * @return relation
  *
  * @author Michael Hsu
  */

  Relation_Users_Tweets.bulkCreate(data.relationList)
  .catch((error)=>{
    console.log(error);
  });

  /**
  * 初始化 Users 列表
  *
  * @param  {string} uid
  *
  * @return {int} tweet_counts: 0
  *
  * @author Michael Hsu
  */

  Users.bulkCreate(data.userResults)
  .catch((error)=>{
    console.log(error);
  });

})
.then(()=>{
  console.log(">> Start async function processing ...");
})
.catch((error)=>{
  console.log(error);
});