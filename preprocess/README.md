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

## Step 1: Construct list

```
time node --max-old-space-size=12192 dist/es6/1_listUsers.js data/sample.csv
time node --max-old-space-size=12192 dist/es6/1_listTweets.js data/sample.csv
```

## Step 2: Count feature

```
time node --max-old-space-size=12192 dist/es6/2_countTweets.js data/sample.csv
time node --max-old-space-size=12192 dist/es6/2_countUsers.js data/sample.csv
```

## Step 3: Construct relation

```
time node --max-old-space-size=12192 dist/es6/3_relationUserTweet.js data/sample.csv
time node --max-old-space-size=12192 dist/es6/3_relationUserUser.js data/sample.csv
```

## Document

![ER-diagram](/image/Weibo ER-diagram.png)