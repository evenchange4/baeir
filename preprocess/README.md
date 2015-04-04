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
time node --max-old-space-size=12192 dist/es6/2_isRetweeted.js
```

## Step 3: Check if imblanced datasets

```
time node --max-old-space-size=12192 dist/es6/3_imbalanceCheck.js
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
time node --max-old-space-size=12192 dist/es6/4_list.js
```

## Step 5: Count feature number

1. 計算 tweet_counts   自己的文章數量（原創文章）
1. 計算 retweet_counts 自己轉錄過多少文章
1. 計算 mention_counts 自己提到多少人
2. 計算 retweeted_counts  被人轉發數量
3. 計算 mentioned_counts  被人提及多少次

```
time node --max-old-space-size=12192 dist/es6/5_count.js
```

## Step 6: Construct relation

1. 建構 Relation of retweet behavior
2. 建構 Relation of mention behavior

```
time node --max-old-space-size=12192 dist/es6/6_relation.js
```


## Document

![ER-diagram](/image/Weibo ER-diagram.png)