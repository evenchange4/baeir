"use strict";

// node_modules
import Promise from "bluebird";
require("babel/register");
import console from "gulp-util";
import Path from "path";
import mkdirp from "mkdirp";
import moment from "moment";
let fs = Promise.promisifyAll(require("fs"));

// self project modules
import $sequelize from "../libs/sequelize";
import * as $sql from "../libs/sql";
import * as $format from "../libs/format";
import $params from "../../configs/parameters.json";
import $relationExtract from "../libs/relationExtract";

// variable
const user_has_relations_count_limit = 5;
const tweet_has_relations_count_limit = 5;
const timestamp = moment().format("YYYYMMDD_HHmmss");
const path = Path.join(__dirname, `/../../../output/${timestamp}/preprocess`);
let relationsMap = new Map();
let usersMap = new Map();
let tweetsMap = new Map();
let tweetsBiasMap = new Map();

let t_retweeted_counts_total = 0;

Promise.resolve()
.then(()=>{
  return mkdirp(path);
})
.then(()=>{
  return $sequelize.sequelize.query($sql.Relation_Users_Retweets, null, { raw: true } );
})
.then((data)=>{
  let relations = data[0];
  return relations;
})
.then((relations)=>{
  let a = $relationExtract(relations, user_has_relations_count_limit, tweet_has_relations_count_limit);
  
  usersMap = a.usersMap;
  tweetsMap = a.tweetsMap;

  return relations;
})
// .each((relation)=>{

//   // tweetsBiasMap.set(
//   //   relation.retweeted_status_mid,
//   //   relation
//   // );
//   // t_retweeted_counts_total = t_retweeted_counts_total + relation.t_retweeted_counts;
//   return relation;
// })
.each((relation)=>{
  if (usersMap.has(relation.uid) && tweetsMap.has(relation.retweeted_status_mid)){
    relationsMap.set(
      `${relation.uid}_${relation.retweeted_status_mid}`, 
      // tweetsMap.get(relation.retweeted_status_mid) * (relation.tweet_retweeted_by_user_count * 24*60*60) / (relation.user_has_tweets_count * relation.tweet_has_been_retweeted_count * $format.toSec(relation.avg_response_time))
      // tweetsMap.get(relation.retweeted_status_mid) / $format.toSec(relation.avg_response_time)
      // usersMap.get(relation.uid).get(relation.retweeted_status_mid) /10 // good
      // (1 + Math.log(usersMap.get(relation.uid).get(relation.retweeted_status_mid) ) ) * ( 1 + Math.log(86400 / $format.toSec(relation.avg_response_time)) )
      ( 1 + Math.log(86400 / $format.toSec(relation.avg_response_time)) )
      // 1 / $format.toSec(relation.avg_response_time)
      // (relation.tweet_retweeted_by_user_count * 24*60*60) / $format.toSec(relation.avg_response_time)
    );
  }
})

/**
* Output report readme
*
* @author Michael Hsu
*/

.then(()=>{
  let totalReport = "";

  console.log(`>> # user_has_relations_count_limit = ${user_has_relations_count_limit}`);
  console.log(`>> # tweet_has_relations_count_limit = ${tweet_has_relations_count_limit}`)

  console.log(`>> # Users = ${usersMap.size}`);
  console.log(`>> # Tweets = ${tweetsMap.size}`);
  console.log(`>> # Relations = ${relationsMap.size}`);

  totalReport = `${totalReport} >> # user_has_relations_count_limit = ${user_has_relations_count_limit} \n`;
  totalReport = `${totalReport} >> # tweet_has_relations_count_limit = ${tweet_has_relations_count_limit} \n`;
  totalReport = `${totalReport} >> # Users = ${usersMap.size} \n`;
  totalReport = `${totalReport} >> # Tweets = ${tweetsMap.size} \n`;
  totalReport = `${totalReport} >> # Relations = ${relationsMap.size} \n`;

  fs.writeFileAsync(`${path}/README.txt`, totalReport);
})

/**
* Output user list
*
* @author Michael Hsu
*/

.then(()=>{
  let usersResult = "";

  usersMap.forEach((value, uid)=>{
    usersResult = `${usersResult}${uid}\n`;
    value.forEach((count, mid)=>{
      usersResult = `${usersResult}${mid} ${count},`;
    })
    usersResult = usersResult.slice(0, - 1);  //去掉最後一個逗號
    usersResult = `${usersResult}\n`
  });

  return fs.writeFileAsync(`${path}/users.txt`, usersResult);
})

/**
* Output tweet list
*
* @author Michael Hsu
*/

.then(()=>{
  console.log(`>> Output file to ${path}/users.txt`);

  let tweetsResult = "";

  tweetsMap.forEach((value, mid)=>{
    tweetsResult = `${tweetsResult}${mid}\n`;
    value.forEach((count, uid)=>{
      tweetsResult = `${tweetsResult}${uid} ${count},`;
    })
    tweetsResult = tweetsResult.slice(0, - 1);  //去掉最後一個逗號
    tweetsResult = `${tweetsResult}\n`
  });

  return fs.writeFileAsync(`${path}/tweets.txt`, tweetsResult);
})

/**
* Output relation csv
*
* @author Michael Hsu
*/

.then(()=>{
  console.log(`>> Output file to ${path}/tweets.txt`);

  let relationsResult = "";

  usersMap.forEach((value, u)=>{
    tweetsMap.forEach((value, t)=>{
      if (relationsMap.has(`${u}_${t}`)){
        relationsResult = `${relationsResult}${relationsMap.get(`${u}_${t}`)},`
      }
      else{
        relationsResult = `${relationsResult}0,`
      }
    });
    relationsResult = relationsResult.slice(0, - 1);  //去掉最後一個逗號
    relationsResult = `${relationsResult}\n`
  });
  return fs.writeFileAsync(`${path}/relations.csv`, relationsResult);
})

/**
* Output tweet bias csv
*
* @author Michael Hsu
*/

// .then(()=>{
//   console.log(`>> Output file to ${path}/relations.csv`);
//   let tweetsBiasResult = "";

//   usersMap.forEach((u)=>{
//     tweetsMap.forEach((value, t)=>{
//       let r = tweetsBiasMap.get(t);
//       tweetsBiasResult = `${tweetsBiasResult}${
//         r.t_retweeted_counts / t_retweeted_counts_total / tweetsBiasMap.size + 
//         r.t_mention_counts + 
//         r.t_mention_counts + 
//         r.t_url_counts + 
//         r.t_expression_counts + 
//         r.t_topic_counts},`
//     });
//     tweetsBiasResult = tweetsBiasResult.slice(0, - 1);  //去掉最後一個逗號
//     tweetsBiasResult = `${tweetsBiasResult}\n`
//   });

//   return fs.writeFileAsync(`${path}/tweetsBias.csv`, tweetsBiasResult);

// })
.then(()=>{
  console.log(`>> Output file to ${path}/tweetsBias.csv`);
})
.catch((error)=>{
  console.log({error});
});