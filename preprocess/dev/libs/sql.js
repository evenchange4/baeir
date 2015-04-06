"use strict";

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

// Traing 與 Testing 的 Users 交集，受試者 ( > 25)
// 4438 資料列
// 總共執行時間: 17,048.068 ms
export const users = ` \
SELECT \
  b.uid AS "uid", \
  a.a_counts AS "a_counts",  \
  COUNT(b.uid) AS "b_counts", \
  a.a_counts+ COUNT(b.uid) AS "total" \
FROM \
  ( \
  SELECT  \
    a.uid AS "a_uid",  \
    COUNT(a.uid) AS "a_counts" \
  FROM  \
    "Tweets_Trains" a \
  GROUP BY  \
    a.uid \
  HAVING \
    COUNT(a.uid) > 25 \
  ) AS a \
INNER JOIN  \
  "Tweets_Tests" b \
ON  \
  a.a_uid=b.uid \
GROUP BY  \
  b.uid, \
  a.a_counts \
HAVING \
  COUNT(b.uid) > 25 \
`
