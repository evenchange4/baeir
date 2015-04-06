SELECT
  COUNT(U)
FROM
  (
  SELECT
    R.uid
  FROM
    "Relation_Users_Tweets" AS R
  GROUP BY
    R.uid
  ) AS U
