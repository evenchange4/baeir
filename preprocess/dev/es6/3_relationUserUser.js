"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";

// Model Schema
const Relation_Retweet = $sequelize.Relation_Retweet;
const Relation_Mention = $sequelize.Relation_Mention;

// parse file
const filePath = process.argv[2];
const lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  let [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
  
  /**
  * 建構 Relation User / User
  *
  * @param  {string} uid
  * @param  {string} retweeted_uid
  *
  * @return {Boolean} uid1_retweet_uid2
  *
  * @author Michael Hsu
  */

  Promise.resolve()
  .then(()=>{
    if(retweeted_uid === ""){
      Promise.reject("not retweeted");
    }
    else{
      return true;
    }
  })
  .then(()=>{
    return Users_Users.create({ 
      uid1: uid,
      uid2: retweeted_uid,
      uid1_retweet_uid2: true
    });
  })
  .catch((error)=>{
    console.log({line});
    console.log(error);
  });

  /**
  * 建構 Relation User / User
  *
  * @param  {string} uid
  * @param  {string} retweeted_uid
  *
  * @return {Boolean} uid1_retweet_uid2
  *
  * @author Michael Hsu
  */

  const regex1 = /@(\S){8,9}：/g;  // example: "@uMLLV3ZCO：", "@uMLLV3ZO："
  
  var mention_list = text.match(regex1) || [];

  Promise.resolve(mention_list)
  .map((mention)=>{
    var mentioned_uid = mention.replace(/@/,"").replace(/：/,"");
    return Users.findOrCreate({ where:{ uid: mentioned_uid } });
  })

});

