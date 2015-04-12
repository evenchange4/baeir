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

export const Relation_Users_Retweets = ` \
SELECT \
  A.uid, \
  A.mid, \
  A.retweeted_status_mid, \
  B.created_at AS "origin_time", \
  A.retweeted_time, \
  A.retweeted_time - B.created_at AS "reponse_time", \
  A.rtcount, \
  A.ucount \
FROM \
  ( \
  SELECT  \
    T.uid, \
    T.mid, \
    T.retweeted_status_mid, \
    T.created_at AS "retweeted_time", \
    U.rtcount, \
    R.ucount \
  FROM \
    "Tweets" AS T \
  INNER JOIN \
    ( \
    SELECT \
      uid, \
      COUNT(retweeted_status_mid) AS "rtcount" \
    FROM \
      "Tweets" AS t \
    WHERE \
      t."isOriginal" = false \
    GROUP BY \
      uid \
    HAVING \
      COUNT(retweeted_status_mid) > ${$params.userHasMoreThan_Tweets} \
    ) AS U \
  ON  \
    U.uid = T.uid \
  INNER JOIN \
    ( \
    SELECT \
      retweeted_status_mid, \
      COUNT(uid) AS "ucount" \
    FROM \
      "Tweets" AS t \
    WHERE \
      t."isOriginal" = false \
    GROUP BY \
      retweeted_status_mid \
    HAVING \
      COUNT(uid) > ${$params.tweetHasBeenRetweetedMoreThan_Uwers} \
    ) AS R \
  ON  \
    T.retweeted_status_mid = R.retweeted_status_mid \
  WHERE \
    T."isOriginal" = false \
  ) AS A \
INNER JOIN  \
  "Tweets" AS B \
ON \
  A.retweeted_status_mid = B.mid \
`