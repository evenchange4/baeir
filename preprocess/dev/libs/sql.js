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
