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

npm i
npm run build
npm run db
```

## Preprocess Flow

![Preprocess flow](/image/Preprocess flow.png)

## Step 1: Separate Datasets

- Choose separate date: 

```
// Separate Date
const Train_Start = new Date("2012-12-10 20:00:00").getTime();
const Train_End =   new Date("2012-12-10 21:59:59").getTime();
const Test_Start =  new Date("2012-12-10 22:00:00").getTime();
const Test_End =    new Date("2012-12-10 22:59:59").getTime();
```

```
time node --max-old-space-size=12192 dist/es6/1_separateDataset.js data/week50.csv
```

## Step 2: isRetweeted

1. 是否被轉錄過 isRetweeted
1. 計算 retweeted_counts  被轉錄多少次

```
npm run 2
```

## Step 3: Check if imblanced datasets

```
npm run 3
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

## Step 4: Extract List / Relation

1. 初始化 Expressions 列表
2. 初始化 Topics 列表
3. 建構 Relation between User and Tweet
4. 初始化 Users 列表

```
npm run 4
```

## Step 5: Count feature number

1. 初始化 Users 列表
2. 計算 tweet_counts   自己的文章數量（原創文章）
3. 計算 retweet_counts 自己轉錄過多少文章
4. 計算 mention_counts 自己提到多少人
5. 計算 retweeted_counts  被人轉發數量
6. 注意，這邊的數量有可能會跟 Tweets 算得不一樣，應為有些沒有 content
7. 計算 mentioned_counts  被人提及多少次

```
npm run 5
```

## Step 6: Construct relation

1. 建構 Relation of retweet behavior
2. 建構 Relation of mention behavior

```
npm run 6
```

## Document

![ER-diagram](/image/Weibo ER-diagram.png)