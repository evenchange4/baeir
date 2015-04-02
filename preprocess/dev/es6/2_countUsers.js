"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project
import $sequelize from "../libs/sequelize";

// Model Schema
var Users = $sequelize.Users;
// var Users_Tweets = $sequelize.Users_Tweets;

var filePath = process.argv[2];
var lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
  
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

  var req1 = /@(\S){8,9}：/g;  // example: "@uMLLV3ZCO：", "@uMLLV3ZO："
  var req2 = /@ukn：/g;        // example: "@ukn："
  
  var mention_list = text.match(req1) || [];

  Promise.resolve()
  .then(()=>{
    return Users.find({ where:{ uid } });
  })
  .then((user)=>{
    if (retweeted_status_mid === ""){
      return user.increment({ 
        tweet_counts: 1,
        mention_counts: mention_list.length + (text.match(req2) || []).length       
      });
    }
    else{
      return user.increment({ 
        retweet_counts: 1,
        mention_counts: mention_list.length + (text.match(req2) || []).length       
      });
    }
  })
  .catch((error)=>{
    console.log({line});
    console.log(error);
  });

  /**
  * 計算 retweeted_counts  被人轉發數量
  *
  * @param  {string} retweeted_uid
  *
  * @return {int} retweet_counts: +1
  *
  * @author Michael Hsu
  */

  Promise.resolve()
  .then(()=>{
    return Users.findOrCreate({ where:{ uid: retweeted_uid } });
  })
  .then((user)=>{
    return user[0].increment({ retweeted_counts: 1 });
  })
  .catch((error)=>{
    console.log({line});
    console.log(error);
  });

  /**
  * 計算 mentioned_counts  被人提及多少次
  *
  * @param  {string} retweeted_uid
  *
  * @return {int} mention_counts
  *
  * @author Michael Hsu
  */

  var mentioned_uid = "";

  Promise.resolve(mention_list)
  .map((mention)=>{
    mentioned_uid = mention.replace(/@/,"").replace(/：/,"");
    return Users.findOrCreate({ where:{ uid: mentioned_uid } });
  })
  .map((user)=>{
    return user[0].increment({ mentioned_counts: 1 });
  })
  .catch((error)=>{
    console.log({line});
    console.log(error);
  });

});

