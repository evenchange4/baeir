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

```
time node --max-old-space-size=12192 dist/es6/1_separateDataset.js data/week50.csv
```

## Step 2: Check if imblanced datasets

```
time node --max-old-space-size=12192 dist/es6/2_imbalanceCheck.js
```

## Step 3: Extract List / Relation

1. 初始化 Expressions 列表
2. 初始化 Topics 列表
3. 建構 Relation between User and Tweet
4. 初始化 Users 列表

```
time node --max-old-space-size=12192 dist/es6/3_list.js
```

## Step 4: Count feature number

1. 計算 tweet_counts   自己的文章數量（原創文章）
1. 計算 retweet_counts 自己轉錄過多少文章
1. 計算 mention_counts 自己提到多少人
2. 計算 retweeted_counts  被人轉發數量
3. 計算 mentioned_counts  被人提及多少次
4. 計算 retweeted_counts  被轉錄多少次

```
time node --max-old-space-size=12192 dist/es6/4_count.js
```

## Step 5: Construct relation

1. 建構 Relation between User and Tweet
2. 建構 Relation of retweet behavior
3. 建構 Relation of mention behavior

```
time node --max-old-space-size=12192 dist/es6/5_relation.js
```


## Document

![ER-diagram](/image/Weibo ER-diagram.png)