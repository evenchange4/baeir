"use strict";

// node_modules
import Promise from "bluebird";

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
    attributes:[ "mid", "uid", "text", "isOriginal" ] 
  });
})
.map((tweet)=>{
  let mid = tweet.dataValues.mid;
  let uid = tweet.dataValues.uid;
  let text = tweet.dataValues.text;
  let isOriginal = tweet.dataValues.isOriginal;

  let expressionList = text.match($regex.expression) || [];
  let topicList = text.match($regex.topic) || [];

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

  expressionList.map((expression)=>{
    Expressions.findOrCreate({ 
      where:{ 
        expression: expression.replace(/\[|\]/g,"")
      } 
    })
    .then((expression)=>{
      expression[0].increment({ 
        tweet_counts: isOriginal ? 1 : 0,
        retweet_counts: isOriginal ? 0 : 1
      });
    })
    .catch((error)=>{
      // console.log(error);
    });
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

  topicList.map((topic)=>{
    Topics.findOrCreate({ 
      where:{ 
        topic: topic.replace(/#/g,"")
      } 
    })
    .then((topic)=>{
      topic[0].increment({ 
        tweet_counts: isOriginal ? 1 : 0,
        retweet_counts: isOriginal ? 0 : 1
      });
    })
    .catch((error)=>{
      // console.log(error);
    });
  });

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

  Relation_Users_Tweets.create({ mid, uid })
  .catch((error)=>{
    // console.log(error);
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

  Users.create({ uid , tweet_counts: 0 })
  .catch((error)=>{
    // console.log(error);
  });

})
.catch((error)=>{
  // console.log(error);
});