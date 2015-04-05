"use strict";

// node_modules
import Promise from "bluebird";
require("babel/register");
import console from "gulp-util";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $regex from "../libs/regex";

// Model Schema
const Tweets_Trains = $sequelize.Tweets_Trains;
const Expressions = $sequelize.Expressions;
const Topics = $sequelize.Topics;
const Relation_Users_Tweets = $sequelize.Relation_Users_Tweets;
const Users = $sequelize.Users;
const Relation_Users_Users = $sequelize.Relation_Users_Users;

/**
* 1. 初始化 Expressions 列表
* 2. 初始化 Topics 列表
* 3. 建構 Relation between User and Tweet
* 4. 初始化 Users 列表
* 2. 計算 tweet_counts   自己的文章數量（原創文章）
* 3. 計算 retweet_counts 自己轉錄過多少文章
* 4. 計算 mention_counts 自己提到多少人
* 5. 計算 retweeted_counts  被人轉發數量
* 6. 注意，這邊的數量有可能會跟 Tweets 算得不一樣，應為有些沒有 content
* 7. 計算 mentioned_counts  被人提及多少次
* 8. 建構 Relation of retweet behavior
* 9. 建構 Relation of mention behavior
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  var tablesList = [
    "Users", 
    "Expressions",
    "Topics",
    "Relation_Users_Users", 
    "Relation_Users_Tweets",
    ];

  return $sequelize.sync(tablesList);
})
.then((msg)=>{
  console.log(msg);
})
.then(()=>{
  return Tweets_Trains.findAll({
    where: {}, 
    attributes:[ "mid", "uid", "retweeted_uid", "text", "isRetweeted", "retweeted_counts", "isOriginal", "isgeo" ] 
  });
})
.then((tweets)=>{

  let expressionMap = new Map();
  let topicMap = new Map();
  let relationList = [];
  let userMap = new Map();
  let relation_UsersMap = new Map();

  // ============================================
  // for each tweet loop
  // ============================================
  console.log(">> For each tweet loop ...");
  
  tweets.forEach((tweet)=>{
    let { mid, uid, retweeted_uid, text, isRetweeted, retweeted_counts, isOriginal, isgeo } = tweet;
    
    relationList.push({ mid, uid });

    let expressionList = text.match($regex.expression) || [];
    let topicList = text.match($regex.topic) || [];
    let mentionList = text.match($regex.mention) || [];
    let mentionListUkn = text.match($regex.mentionUkn) || [];
    let urlList = text.match($regex.url) || [];

    if(!userMap.has(uid)) {
      userMap.set(uid, {
        tweet_counts: (isOriginal ? 1 : 0),
        retweet_counts: (isOriginal ? 0 : 1),
        mention_counts: mentionList.length + mentionListUkn.length,
        url_counts: urlList.length,
        expression_counts: expressionList.length,
        topic_counts: topicList.length,
        geo_counts: (isgeo ? 1 : 0),
        retweeted_counts: 0,
        mentioned_counts: 0
      });
    }
    else{
      userMap.set(uid, {
        tweet_counts: userMap.get(uid).tweet_counts + (isOriginal ? 1 : 0),
        retweet_counts: userMap.get(uid).retweet_counts + (isOriginal ? 0 : 1),
        mention_counts: userMap.get(uid).mention_counts + mentionList.length + mentionListUkn.length,
        url_counts: userMap.get(uid).url_counts + urlList.length,
        expression_counts: userMap.get(uid).expression_counts + expressionList.length,
        topic_counts: userMap.get(uid).topic_counts + topicList.length,
        geo_counts: userMap.get(uid).geo_counts + (isgeo ? 1 : 0),
        retweeted_counts: userMap.get(uid).retweeted_counts,
        mentioned_counts: userMap.get(uid).mentioned_counts
      });
    }

    if(uid === "zzzzzzzz"){
      console.log(mentionList);
      console.log(mentionListUkn);  
      console.log(userMap.get("zzzzzzzz").mention_counts);
    }

    if (!isOriginal){
      if (!userMap.has(retweeted_uid)){
        userMap.set(retweeted_uid, {
          tweet_counts: 0,
          retweet_counts: 0,
          mention_counts: 0,
          url_counts: 0,
          expression_counts: 0,
          topic_counts: 0,
          geo_counts: 0,
          retweeted_counts: 1,
          mentioned_counts: 0
        });
      }
      else{
        userMap.set(retweeted_uid, {
          tweet_counts: userMap.get(retweeted_uid).tweet_counts,
          retweet_counts: userMap.get(retweeted_uid).retweet_counts,
          mention_counts: userMap.get(retweeted_uid).mention_counts,
          url_counts: userMap.get(retweeted_uid).url_counts,
          expression_counts: userMap.get(retweeted_uid).expression_counts,
          topic_counts: userMap.get(retweeted_uid).topic_counts,
          geo_counts: userMap.get(retweeted_uid).geo_counts,
          retweeted_counts: userMap.get(retweeted_uid).retweeted_counts + 1,
          mentioned_counts: userMap.get(retweeted_uid).mentioned_counts
        });
      }

      let key1 = `${uid}_${retweeted_uid}`;
      let key2 = `${retweeted_uid}_${uid}`;

      if (relation_UsersMap.has(key1)){
        relation_UsersMap.set(key1, {
          uid1_mention_uid2: relation_UsersMap.get(key1).uid1_mention_uid2,
          uid2_mention_uid1: relation_UsersMap.get(key1).uid2_mention_uid1,
          uid1_retweet_uid2: relation_UsersMap.get(key1).uid1_retweet_uid2 + 1,
          uid2_retweet_uid1: relation_UsersMap.get(key1).uid2_retweet_uid1
        });
      }
      else if (relation_UsersMap.has(key2)){
        relation_UsersMap.set(key2, {
          uid1_mention_uid2: relation_UsersMap.get(key2).uid1_mention_uid2,
          uid2_mention_uid1: relation_UsersMap.get(key2).uid2_mention_uid1,
          uid1_retweet_uid2: relation_UsersMap.get(key2).uid1_retweet_uid2,
          uid2_retweet_uid1: relation_UsersMap.get(key2).uid2_retweet_uid1 + 1
        });
      }
      else{
        relation_UsersMap.set(key1, {
          uid1_mention_uid2: 0,
          uid2_mention_uid1: 0,
          uid1_retweet_uid2: 1,
          uid2_retweet_uid1: 0
        });
      }
    }

    mentionList.forEach((mention)=>{
      mention = mention.replace(/@|：/g,"");
      if (!userMap.has(mention)){
        userMap.set(mention, {
          tweet_counts: 0,
          retweet_counts: 0,
          mention_counts: 0,
          url_counts: 0,
          expression_counts: 0,
          topic_counts: 0,
          geo_counts: 0,
          retweeted_counts: 0,
          mentioned_counts: 1
        });
      }
      else{
        userMap.set(mention, {
          tweet_counts: userMap.get(mention).tweet_counts,
          retweet_counts: userMap.get(mention).retweet_counts,
          mention_counts: userMap.get(mention).mention_counts,
          url_counts: userMap.get(mention).url_counts,
          expression_counts: userMap.get(mention).expression_counts,
          topic_counts: userMap.get(mention).topic_counts,
          geo_counts: userMap.get(mention).geo_counts,
          retweeted_counts: userMap.get(mention).retweeted_counts,
          mentioned_counts: userMap.get(mention).mentioned_counts + 1
        });
      }

      let key1 = `${uid}_${mention}`;
      let key2 = `${mention}_${uid}`;

      if (relation_UsersMap.has(key1)){
        relation_UsersMap.set(key1, {
          uid1_mention_uid2: relation_UsersMap.get(key1).uid1_mention_uid2 + 1,
          uid2_mention_uid1: relation_UsersMap.get(key1).uid2_mention_uid1,
          uid1_retweet_uid2: relation_UsersMap.get(key1).uid1_retweet_uid2,
          uid2_retweet_uid1: relation_UsersMap.get(key1).uid2_retweet_uid1
        });
      }
      else if (relation_UsersMap.has(key2)){
        relation_UsersMap.set(key2, {
          uid1_mention_uid2: relation_UsersMap.get(key2).uid1_mention_uid2,
          uid2_mention_uid1: relation_UsersMap.get(key2).uid2_mention_uid1 + 1,
          uid1_retweet_uid2: relation_UsersMap.get(key2).uid1_retweet_uid2,
          uid2_retweet_uid1: relation_UsersMap.get(key2).uid2_retweet_uid1
        });
      }
      else{
        relation_UsersMap.set(key1, {
          uid1_mention_uid2: 1,
          uid2_mention_uid1: 0,
          uid1_retweet_uid2: 0,
          uid2_retweet_uid1: 0
        });
      }
    });

    topicList.forEach((topic) => {
      topic = topic.replace(/#/g,"");
      if(!topicMap.has(topic)) {
        topicMap.set(topic, { 
          retweeted_counts,
          nonretweeted_counts: (isRetweeted ? 0 : 1)
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
          nonretweeted_counts: (isRetweeted ? 0 : 1)
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
  
  // ============================================
  // results formating
  // ============================================

  console.log(">> Results formating ...");

  let expressionResults = [];
  let topicResults = [];
  let userResults = [];
  let relation_UsersResults = [];

  relation_UsersMap.forEach((value, key)=>{
    let [ uid1, uid2 ] = key.split("_");
    relation_UsersResults.push({
      uid1,
      uid2,
      uid1_mention_uid2: value.uid1_mention_uid2,
      uid2_mention_uid1: value.uid2_mention_uid1,
      uid1_retweet_uid2: value.uid1_retweet_uid2,
      uid2_retweet_uid1: value.uid2_retweet_uid1
    });
  });

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
      retweeted_counts: value.retweeted_counts,
      mentioned_counts: value.mentioned_counts
    });
  });

  return {
    expressionResults, 
    topicResults,
    userResults,
    relationList,
    relation_UsersResults
  };
})
.then((data)=>{
  return new Promise((resolve, reject) => {
    Promise.resolve()
    .then(()=>{
      console.log(">> start Expressions ...");
      return Expressions.bulkCreate(data.expressionResults);
    })
    .then(()=>{
      console.log(">> start Topics ...");
      return Topics.bulkCreate(data.topicResults);
    })
    .then(()=>{
      console.log(">> start Relation_Users_Tweets ...");
      return Relation_Users_Tweets.bulkCreate(data.relationList);
    })
    .then(()=>{
      console.log(">> start Users ...");
      return Users.bulkCreate(data.userResults);
    })
    .then(()=>{
      console.log(">> start Relation_Users_Users ...");
      return Relation_Users_Users.bulkCreate(data.relation_UsersResults);
    })
    .then(()=>{
      resolve("Finished.")
    })
    .catch((error)=>{
      reject(error);
    });
  });

  /**
  * 初始化 Expressions 列表
  * 初始化 Topics 列表
  * 建構 Relation between User and Tweet
  *
  * @param  {array} expressionList
  * @param  {array} topicList
  *
  * @return {int} tweet_counts 
  * @return {int} retweet_counts
  *
  * @author Michael Hsu
  */

  // Expressions.bulkCreate(data.expressionResults)
  // .then(()=>{
  //   console.log(">> Finished Expressions.");
  // })
  // .catch((error)=>{
  //   console.log(error);
  // });

  // Topics.bulkCreate(data.topicResults)
  // .then(()=>{
  //   console.log(">> Finished Topics.");
  // })
  // .catch((error)=>{
  //   console.log(error);
  // });

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

  // Relation_Users_Tweets.bulkCreate(data.relationList)
  // .then(()=>{
  //   console.log(">> Finished Relation_Users_Tweets.");
  // })
  // .catch((error)=>{
  //   console.log(error);
  // });

  /**
  * 初始化 Users 列表
  * 計算 tweet_counts   自己的文章數量（原創文章）
  * 計算 retweet_counts 自己轉錄過多少文章
  * 計算 mention_counts 自己提到多少人
  * 計算 retweeted_counts  被人轉發數量
  * 注意，這邊的數量有可能會跟 Tweets 算得不一樣，應為有些沒有 content
  * 計算 mentioned_counts  被人提及多少次
  *
  * @param  {string} uid
  * @param  {string} retweeted_uid
  * @param  {array} mentionList
  *
  * @return {int} tweet_counts: +1
  * @return {int} retweet_counts: +1
  * @return {int} mention_counts
  * @return {int} retweet_counts: +1
  * @return {int} mention_counts
  *
  * @author Michael Hsu
  */

  // Users.bulkCreate(data.userResults)
  // .then(()=>{
  //   console.log(">> Finished Users.");
  // })
  // .catch((error)=>{
  //   console.log(error);
  // });

  /**
  * 建構 Relation of retweet behavior
  * 建構 Relation of mention behavior
  *
  * @param  {string} uid
  * @param  {string} mention_uid
  * @param  {string} retweeted_uid
  *
  * @return {Boolean} mention_counts + 1
  * @return {Boolean} retweeted_counts + 1
  *
  * @author Michael Hsu
  */


  // Relation_Users_Users.bulkCreate(data.relation_UsersResults)
  // .then(()=>{
  //   console.log(">> Finished Relation_Users_Users.");
  // })
  // .catch((error)=>{
  //   console.log(error);
  // });

})
.then(()=>{
  console.log(">> Start async function processing ...");
})
.catch((error)=>{
  console.log(error);
});