"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $regex from "../libs/regex";

// Model Schema
const Relation_Retweet = $sequelize.Relation_Retweet;
const Relation_Mention = $sequelize.Relation_Mention;

// parse file
const filePath = process.argv[2];
const lr = new LineByLineReader(filePath, {skipEmptyLines: true });

lr.on("line", (line) => {
  let [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
  
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

  Promise.resolve()
  .then(()=>{
    return Relation_Retweet.findOrCreate({ where:{ uid, retweeted_uid } });
  })
  .then((user)=>{
    return user[0].increment({ retweeted_counts: 1 });
  })
  .catch((error)=>{
    console.log({line});
    console.log(error);
  });

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

  let mentionList = text.match($regex.mention) || [];

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
    console.log({line});
    console.log(error);
  });


});

