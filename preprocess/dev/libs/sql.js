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
  T.uid, \
  T.retweeted_uid, \
  T.retweeted_status_mid, \
  T.tweet_retweeted_by_user_count, \
  T.avg_response_time, \
  T.t_retweeted_counts, \
  T.t_text_length, \
  T.t_mention_counts, \
  T.t_url_counts, \
  T.t_expression_counts, \
  T.t_topic_counts, \
  T.t_isgeo, \
  T.t_image, \
  U.tweet_counts AS "u_tweet_counts", \
  U.retweet_counts AS "u_retweet_counts", \
  U.retweeted_counts AS "u_retweeted_counts", \
  U.mention_counts AS "u_mention_counts", \
  U.mentioned_counts AS "u_mentioned_counts", \
  U.url_counts AS "u_url_counts", \
  U.expression_counts AS "u_expression_counts", \
  U.topic_counts AS "u_topic_counts", \
  U.geo_counts AS "u_geo_counts" \
FROM \
  ( \
  SELECT \
    R.uid, \
    T.uid AS "retweeted_uid", \
    R.retweeted_status_mid, \
    R.tweet_retweeted_by_user_count, \
    R.avg_response_time, \
    T.retweeted_counts AS "t_retweeted_counts", \
    T.text_length AS "t_text_length", \
    T.mention_counts AS "t_mention_counts", \
    T.url_counts AS "t_url_counts", \
    T.expression_counts AS "t_expression_counts", \
    T.topic_counts AS "t_topic_counts", \
    T.isgeo AS "t_isgeo", \
    T.image AS "t_image" \
  FROM \
    "Tweets" AS T \
  INNER JOIN \
    ( \
    SELECT \
      T.uid, \
      T.retweeted_status_mid, \
      COUNT(*) AS "tweet_retweeted_by_user_count", \
      AVG(T.response_time) AS "avg_response_time" \
    FROM \
      ( \
      SELECT \
        T.uid, \
        T.retweeted_status_mid, \
        T.created_at - O.created_at AS "response_time"\
      FROM \
        "Tweets" AS T \
      INNER JOIN \
        ( \
        SELECT \
          T.uid\
        FROM \
          ( \
          SELECT \
            B.uid, \
            B.retweeted_status_mid \
          FROM \
            "Tweets" AS A, \
            "Tweets" AS B \
          WHERE \
            A.mid = B.retweeted_status_mid \
          GROUP BY \
            B.uid, \
            B.retweeted_status_mid \
          ) AS T \
        GROUP BY \
          T.uid \
        ) AS U \
      ON \
        U.uid = T.uid \
      INNER JOIN \
        ( \
        SELECT \
          T.retweeted_status_mid\
        FROM \
          ( \
          SELECT \
            B.uid, \
            B.retweeted_status_mid \
          FROM \
            "Tweets" AS A, \
            "Tweets" AS B \
          WHERE \
            A.mid = B.retweeted_status_mid \
          GROUP BY \
            B.uid, \
            B.retweeted_status_mid \
          ) AS T \
        GROUP BY \
          T.retweeted_status_mid \
        ) AS R \
      ON \
        R.retweeted_status_mid = T.retweeted_status_mid \
      INNER JOIN \
        "Tweets" AS O \
      ON \
        T.retweeted_status_mid = O.mid \
      ) AS T \
    GROUP BY \
      T.uid, \
      T.retweeted_status_mid \
    ORDER BY \
      T.uid DESC, \
      T.retweeted_status_mid DESC \
    ) AS R \
  ON \
    R.retweeted_status_mid = t.mid \
  ) AS T \
INNER JOIN \
  "Users" AS U \
ON \
  U.uid = T.retweeted_uid \
`