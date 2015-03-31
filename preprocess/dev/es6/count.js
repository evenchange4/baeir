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
  * 計算 tweet_counts 
  *
  * @param  {string} uid
  *
  * @return {int} tweet_counts: +1
  *
  * @author Michael Hsu
  */
  Promise.resolve()
  .then(()=>{
    return Users.find({ where:{ uid } });
  })
  .then((user)=>{
    if (user !== null){
      return user.increment({ tweet_counts: 1 });
    }
    else{
      console.log(`uid:[${uid}] not found`);
    }
  })
  .catch((error)=>{
    console.log(error);
  });

  /**
  * 計算 retweet_counts 
  *
  * @param  {string} retweeted_uid
  *
  * @return {int} retweet_counts: +1
  *
  * @author Michael Hsu
  */
  Promise.resolve()
  .then(()=>{
    return Users.find({ where:{ uid: retweeted_uid } });
  })
  .then((user)=>{
    if (user !== null){
      return user.increment({ retweet_counts: 1 });
    }
    else{
      console.log(`retweeted_uid:[${retweeted_uid}] not found`);
      return Users.create({ uid: retweeted_uid, retweet_counts: 1 });
    }
  })
  .catch((error)=>{
    console.log(error);
  });

});

