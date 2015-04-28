"use strict";

// node_modules
import console from "gulp-util";
// require("babel/register");

/**
* Extract usersMap, tweetsMap From relationships, and filter
*
* @input  (array) obj relations
* @input  (int)  userLimit
* @input  (int)  tweetLimit
*
* @output (Map) usersMap
* @output (Map) tweetsMap
*
*
* @author Michael Hsu
*/

export default function relationExtract(relations, userLimit, tweetLimit) {
  let usersMap = new Map();
  let tweetsMap = new Map();

  relations.forEach((relation)=>{
    // 1. 計算 user 得轉推數量
    if (usersMap.has(relation.uid)){
      if(usersMap.get(relation.uid).has(relation.retweeted_status_mid)){
        usersMap.get(relation.uid).set(
          relation.retweeted_status_mid,
          usersMap.get(relation.uid).get(relation.retweeted_status_mid) + relation.tweet_retweeted_by_user_count
        );
      }
      else{
        usersMap.get(relation.uid).set(
          relation.retweeted_status_mid,
          relation.tweet_retweeted_by_user_count
        );
      }
    }
    else{
      let tempMap = new Map();
      tempMap.set(relation.retweeted_status_mid, relation.tweet_retweeted_by_user_count);
      usersMap.set(relation.uid, tempMap);
    }

    // 2. 計算 tweet 轉推數量
    if (tweetsMap.has(relation.retweeted_status_mid)){
      if(tweetsMap.get(relation.retweeted_status_mid).has(relation.uid)){
        tweetsMap.get(relation.retweeted_status_mid).set(
          relation.uid,
          tweetsMap.get(relation.retweeted_status_mid).get(relation.uid) + relation.tweet_retweeted_by_user_count
        );
      }
      else{
        tweetsMap.get(relation.retweeted_status_mid).set(
          relation.uid,
          relation.tweet_retweeted_by_user_count
        );
      }
    }
    else{
      let tempMap = new Map();
      tempMap.set(relation.uid, relation.tweet_retweeted_by_user_count);
      tweetsMap.set(relation.retweeted_status_mid, tempMap);
    }
  });

  // 3. 篩掉 user Limit
  usersMap.forEach((value, uid)=>{
    if (value.size < userLimit){
      usersMap.delete(uid);
    }
  });

  // 4. 篩掉 tweet Limit
  tweetsMap.forEach((value, mid)=>{
    if (value.size < tweetLimit){
      tweetsMap.delete(mid);
    }
  });

  return {usersMap, tweetsMap};
}