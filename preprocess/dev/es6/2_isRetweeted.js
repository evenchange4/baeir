"use strict";

// node_modules
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";

// Model Schema
const Tweets_Trains = $sequelize.Tweets_Trains;
const Tweets_Tests = $sequelize.Tweets_Tests;

/**
* 1. 是否被轉錄過 isRetweeted
* 1. 計算 retweeted_counts  被轉錄多少次
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  return Tweets_Trains.findAll({
    where: {}, 
    attributes:[ "retweeted_status_mid" ] 
  });
})
.map((tweet)=>{
  let retweeted_status_mid = tweet.dataValues.retweeted_status_mid;

  /**
  * 是否被轉錄過 isRetweeted
  * 計算 retweeted_counts  被轉錄多少次
  *
  * @param  {string} retweeted_status_mid
  *
  * @return {Boolean} isRetweeted = true
  * @return {int} retweeted_counts + 1
  *
  * @author Michael Hsu
  */

  Tweets_Trains.find({ where:{ mid: retweeted_status_mid } })
  .then((tweet)=>{
    if (tweet !== null){
      return tweet.updateAttributes({ 
        isRetweeted: true,
        retweeted_counts: tweet.retweeted_counts + 1
      });
    }
  })
  .catch((error)=>{
    // console.log(error);
  });


})
.catch((error)=>{
  // console.log(error);
});


// Test


Promise.resolve()
.then(()=>{
  return Tweets_Tests.findAll({
    where: {}, 
    attributes:[ "retweeted_status_mid" ] 
  });
})
.map((tweet)=>{
  let retweeted_status_mid = tweet.dataValues.retweeted_status_mid;

  /**
  * 是否被轉錄過 isRetweeted
  * 計算 retweeted_counts  被轉錄多少次
  *
  * @param  {string} retweeted_status_mid
  *
  * @return {Boolean} isRetweeted = true
  * @return {int} retweeted_counts + 1
  *
  * @author Michael Hsu
  */

  Tweets_Tests.find({ where:{ mid: retweeted_status_mid } })
  .then((tweet)=>{
    if (tweet !== null){
      return tweet.updateAttributes({ 
        isRetweeted: true,
        retweeted_counts: tweet.retweeted_counts + 1
      });
    }
  })
  .catch((error)=>{
    // console.log(error);
  });


})
.catch((error)=>{
  // console.log(error);
});
