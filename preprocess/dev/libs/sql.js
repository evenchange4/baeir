"use strict";

// example: "uMLLV3ZCO", "2"
export const isRetweetedTrains = `\
SELECT a.mid AS "retweeted_status_mid", COUNT(a.mid) AS "retweeted_counts" \
FROM   "Tweets_Trains" a, "Tweets_Trains" b \
WHERE  a.mid=b.retweeted_status_mid \
GROUP  BY a.mid \
`;     

export const isRetweetedTests = `\
SELECT a.mid AS "retweeted_status_mid", COUNT(a.mid) AS "retweeted_counts" \
FROM   "Tweets_Tests" a, "Tweets_Tests" b \
WHERE  a.mid=b.retweeted_status_mid \
GROUP  BY a.mid \
`;     