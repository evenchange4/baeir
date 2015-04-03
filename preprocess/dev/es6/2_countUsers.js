"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $regex from "../libs/regex";

// Model Schema
const Users = $sequelize.Users;

// parse file
const filePath = process.argv[2];
const lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  let [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
  
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
  
  var mentionList = text.match($regex.mention) || [];

  Promise.resolve()
  .then(()=>{
    return Users.find({ where:{ uid } });
  })
  .then((user)=>{
    return user.increment({ 
      tweet_counts: retweeted_status_mid ? 1 : 0,
      retweet_counts: retweeted_status_mid ? 0 : 1,
      mention_counts: mentionList.length + (text.match($regex.mentionUkn) || []).length,
      url_counts: (text.match($regex.url) || []).length,
      expression_counts: (text.match($regex.expression) || []).length,
      topic_counts: (text.match($regex.topic) || []).length,
      geo_counts: geo.match($regex.geo) ? 1 : 0 
    });
  })
  .catch((error)=>{
    // console.log({line});
    // console.log(error);
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
    // console.log({line});
    // console.log(error);
  });

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
    // console.log({line});
    // console.log(error);
  });

});

