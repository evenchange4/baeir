"use strict";

// node_modules
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $regex from "../libs/regex";

// Model Schema
const Tweets_Trains = $sequelize.Tweets_Trains;
const Relation_Users_Tweets = $sequelize.Relation_Users_Tweets;
const Relation_Retweet = $sequelize.Relation_Retweet;
const Relation_Mention = $sequelize.Relation_Mention;

/**
* 建構 Relation between User and Tweet
* 建構 Relation of retweet behavior
* 建構 Relation of mention behavior
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  return Tweets_Trains.findAll({
    where: {}, 
    attributes:[ "mid", "retweeted_uid", "uid", "text", "isOriginal" ] 
  });
})
.map((tweet)=>{
  let mid = tweet.dataValues.mid;
  let uid = tweet.dataValues.uid;
  let text = tweet.dataValues.text;
  let retweeted_uid = tweet.dataValues.retweeted_uid;
  let isOriginal = tweet.dataValues.isOriginal;

  let mentionList = text.match($regex.mention) || [];

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
  
  Relation_Users_Tweets.create({ mid, uid })
  .catch((error)=>{
    // console.log(error);
  });
  
  /**
  * 建構 Relation of retweet behavior
  *
  * @param  {string} uid
  * @param  {string} retweeted_uid
  *
  * @return {Boolean} retweeted_counts + 1
  *
  * @author Michael Hsu
  */
  if (!isOriginal){
    Relation_Retweet.findOrCreate({ where:{ uid, retweeted_uid } })
    .then((user)=>{
      return user[0].increment({ retweeted_counts: 1 });
    })
    .catch((error)=>{
      // console.log(error);
    });
  }
  
  /**
  * 建構 Relation of mention behavior
  *
  * @param  {string} uid
  * @param  {string} mention_uid
  *
  * @return {Boolean} mention_counts + 1
  *
  * @author Michael Hsu
  */
  
  Promise.resolve(mentionList)
  .map((mention)=>{
    return Relation_Mention.findOrCreate({ 
      where:{ 
        uid,
        mention_uid: mention.replace(/@|：/g,""),
      } 
    });
  })
  .map((user)=>{
    return user[0].increment({ mention_counts: 1 });
  })
  .catch((error)=>{
    // console.log(error);
  });
  
});

