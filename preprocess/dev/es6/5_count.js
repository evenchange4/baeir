"use strict";

// node_modules
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $regex from "../libs/regex";

// Model Schema
const Tweets_Trains = $sequelize.Tweets_Trains;
const Users = $sequelize.Users;

/**
* 1. 計算 tweet_counts   自己的文章數量（原創文章）
* 1. 計算 retweet_counts 自己轉錄過多少文章
* 1. 計算 mention_counts 自己提到多少人
* 2. 計算 retweeted_counts  被人轉發數量
* 3. 計算 mentioned_counts  被人提及多少次
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  return Tweets_Trains.findAll({
    where: {}, 
    attributes:[ "retweeted_uid", "uid", "text", "isOriginal", "isgeo" ]  
  });
})
.then((tweets)=>{
  let { retweeted_uid, uid, text, isOriginal, isgeo } = tweets;

  

})
.map((tweet)=>{
  let uid = tweet.dataValues.uid;
  let text = tweet.dataValues.text;
  let isOriginal = tweet.dataValues.isOriginal;
  let isgeo = tweet.dataValues.isgeo;
  let retweeted_uid = tweet.dataValues.retweeted_uid;

  let mentionList = text.match($regex.mention) || [];

  /**
  * 計算 tweet_counts   自己的文章數量（原創文章）
  * 計算 retweet_counts 自己轉錄過多少文章
  * 計算 mention_counts 自己提到多少人
  *
  * @param  {string} uid
  *
  * @return {int} tweet_counts: +1
  * @return {int} retweet_counts: +1
  * @return {int} mention_counts
  *
  * @author Michael Hsu
  */

  Users.find({ where:{ uid } })
  .then((user)=>{
    return user.increment({ 
      tweet_counts: isOriginal ? 1 : 0,
      retweet_counts: isOriginal ? 0 : 1,
      mention_counts: mentionList.length + (text.match($regex.mentionUkn) || []).length,
      url_counts: (text.match($regex.url) || []).length,
      expression_counts: (text.match($regex.expression) || []).length,
      topic_counts: (text.match($regex.topic) || []).length,
      geo_counts: isgeo ? 1 : 0 
    });
  })
  .catch((error)=>{
    // console.log(error);
  });

  /**
  * 計算 retweeted_counts  被人轉發數量
  * 注意，這邊的數量有可能會跟 Tweets 算得不一樣，應為有些沒有 content
  *
  * @param  {string} retweeted_uid
  *
  * @return {int} retweet_counts: +1
  *
  * @author Michael Hsu
  */
  if (retweeted_uid !== ""){
    Users.findOrCreate({ where:{ uid: retweeted_uid } })
    .then((user)=>{
      return user[0].increment({ retweeted_counts: 1 });
    })
    .catch((error)=>{
      // console.log(error);
    });

  }

  /**
  * 計算 mentioned_counts  被人提及多少次
  *
  * @param  {array} mentionList
  *
  * @return {int} mention_counts
  *
  * @author Michael Hsu
  */

  Promise.resolve(mentionList)
  .map((mention)=>{
    return Users.findOrCreate({ 
      where:{ 
        uid: mention.replace(/@|：/g,"")
      } 
    });
  })
  .map((user)=>{
    return user[0].increment({ mentioned_counts: 1 });
  })
  .catch((error)=>{
    // console.log(error);
  });


})
.catch((error)=>{
  // console.log(error);
});
