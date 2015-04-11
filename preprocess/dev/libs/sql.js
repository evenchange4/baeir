"use strict";

import $params from "../../configs/parameters.json";

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

// isTrain count
// 假      26265
// 假      1332
// 真      106203
// 真      4179
export const imbalance = ` \
SELECT \
  R."isTrain", \
  T."isRetweeted", \
  COUNT(T."isRetweeted") \
FROM \
  "Tweets" AS T \
INNER JOIN \
  "Relation_Users_Tweets" AS R \
ON  \
  T.mid=R.mid \
GROUP BY  \
  R."isTrain", \
  T."isRetweeted" \
`

export const testerCount = ` \
SELECT \
  COUNT(U) \
FROM \
  ( \
  SELECT \
    R.uid \
  FROM \
    "Relation_Users_Tweets" AS R \
  GROUP BY \
    R.uid \
  ) AS U \
`

export const Relation_Users_Retweets = `\
SELECT  \
  R.uid, \
  R.retweeted_status_mid, \
  T.rtcount, \
  R2.ucount \
FROM \
  "Tweets" AS R \
INNER JOIN \
  ( \
  SELECT \
    t.uid, \
    COUNT(t.retweeted_status_mid) AS "rtcount" \
  FROM \
    "Tweets" AS t \
  WHERE \
    t."isOriginal" = false \
  GROUP BY \
    t.uid \
  HAVING \
    COUNT(t.retweeted_status_mid) > ${$params.userHasMoreThan_Tweets} \
  ) AS T \
ON  \
  T.uid = R.uid \
INNER JOIN \
  ( \
  SELECT \
    t.retweeted_status_mid, \
    COUNT(t.uid) AS "ucount" \
  FROM \
    "Tweets" AS t \
  WHERE \
    t."isOriginal" = false \
  GROUP BY \
    t.retweeted_status_mid \
  HAVING \
    COUNT(t.uid) > ${$params.tweetHasBeenRetweetedMoreThan_Uwers} \
  ) AS R2 \
ON  \
  R.retweeted_status_mid = R2.retweeted_status_mid \
WHERE \
  R."isOriginal" = false \
`
