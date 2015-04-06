## Weibo Datasets Preprocessing

- Dataset: Open Weiboscope Data Access 香港大學 http://147.8.142.179/datazip/

## Configuration

Edit `configs.json`

```
{
  "database":"database",
  "username":"username",
  "password":"password",
  "host":"localhost",
  "port": 5432,
  "dialect": "postgres",
  "logging": false,
  "force": false
}
```

## Setup environment

```
npm i babel -g
npm install -g mocha

npm i
npm run build
npm run db
```

## Step 1: Separate Datasets

- 初始化 Tweets Datasets 列表
- Choose separate started day and ended day: 

```
time node --max-old-space-size=12192 dist/es6/1_separateDataset.js data/week50.csv 10 10
```

## Step 2: Label isRetweeted

1. 是否被轉錄過 isRetweeted
2. 計算 retweeted_counts 被轉錄多少次

```
npm run 2
```

## Step 3: Extract list / relation Features

1. Aggregate By Users，找出所有受訪者的 Tweets
2. 篩選出前 4/5 為 Training Datasets
3. Extract feature from raw tweets
  1. 初始化 Expressions 列表
  2. 初始化 Topics 列表
  3. 建構 Relation between User and Tweet
  4. 初始化 Users 列表
  2. 計算 tweet_counts   自己的文章數量（原創文章）
  3. 計算 retweet_counts 自己轉錄過多少文章
  4. 計算 mention_counts 自己提到多少人
  5. 計算 retweeted_counts  被人轉發數量
  6. 注意，這邊的數量有可能會跟 Tweets 算得不一樣，應為有些沒有 content
  7. 計算 mentioned_counts  被人提及多少次
  8. 建構 Relation of retweet behavior
  9. 建構 Relation of mention behavior

```
npm run 3
```

## Step 4: Check if imblanced datasets 

```
npm run 4
```

- Results: 

```
Trains
Positive: 
Negative: 

Tests
Positive: 
Negative: 
```

![Preprocess flow](/image/Preprocess flow 2.png)

## Test

```
npm run local
npm run test
```

## Document

![ER-diagram](/image/Weibo ER-diagram.png)