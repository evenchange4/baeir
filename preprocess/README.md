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