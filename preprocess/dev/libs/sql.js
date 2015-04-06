"use strict";

import $params from "../../parameters.json";

// example: "uMLLV3ZCO", "2"
export const isRetweeted = `\
SELECT \
  a.mid AS "retweeted_status_mid", \
  COUNT(a.mid) AS "retweeted_counts" \
FROM \
  "Tweets" a, \ 
  "Tweets" b \
WHERE \ 
  a.mid=b.retweeted_status_mid \
GROUP BY \
  a.mid \
`;     

export const aggregateByUsers = ` \
SELECT \
  * \
FROM \
  "Tweets" AS Tweets \
INNER JOIN \
  ( \
  SELECT \
    t.uid AS "uid" \
  FROM \
    "Tweets" AS t \
  GROUP BY \
    t.uid \
  HAVING \
    COUNT(t.mid) >= ${$params.lowerLimitOfTweetConuts} \
  ) AS Users \
ON  \
  Tweets.uid=Users.uid \
ORDER BY \
  Tweets.created_at ASC \
`

// Traing 與 Testing 的 Users 交集，受試者 ( > 25)
// 4438 資料列
// 總共執行時間: 17,048.068 ms
export const filter = `\
SELECT \
  T.uid,  \
  T.mid,  \
  T."isRetweeted",  \
  T.retweeted_counts \
FROM \
  ( \
  SELECT \
    u.uid,  \
    u.tweet_counts,  \
    u.retweet_counts,   \
    u.tweet_counts + u.retweet_counts AS "total" \
  FROM \
    "Users" AS u \
  WHERE \
    u.tweet_counts + u.retweet_counts > 40 and \
    u.tweet_counts > 8 and \
    u.retweet_counts > 8 \
  ) AS U \
INNER JOIN \
  "Relation_Users_Tweets" AS R \
ON \
  U.uid=R.uid \
INNER JOIN \
  "Tweets" AS T \
ON \
  R.mid=T.mid  \
ORDER BY  \
  T.created_at ASC \
`
