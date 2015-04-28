#!/usr/bin/Rscript
args<-commandArgs(TRUE)

# ===============================================
# Functions
# ===============================================

getTesters = function(m, numberOfTesters){
  numberOfUsers = nrow(m)
  numberOfTweets = ncol(m)
  testers = sample(1:numberOfUsers, numberOfTesters)

  removeTesters = c()
  for(tester in testers){
    tweets = m[tester,]
    positive = c()
    for(i in 1:numberOfTweets){
      if(tweets[i] > 0){
        positive = c(positive, i)
      }
    }

    # 移除沒有半個 tweets 
    if (length(positive) <= 0){
      removeTesters = c(removeTesters, tester)
    }

  }

  testers = testers [! testers %in% removeTesters]

  return(testers)
}

getTestTweets = function(m, tester, numberOfTestTweets){
  # tweets = sample()
  testerTweets = c()
  for(i in 1:length(m[tester,])){
    if(m[tester,i] > 0){
      testerTweets = c(testerTweets,i)
    }
  }
  sample = sample(testerTweets, 1)
  return(sample)
}

getPopularityScoreMatrix = function(m, tester, testTweet){

  userNumber = nrow(m)
  tweetNumber = ncol(m)

  popularityScoreMatrix = t(matrix(0, tweetNumber))

  for(user in 1:userNumber){
    for (tweet in 1:tweetNumber) {
      if( (user == tester) && (tweet == testTweet) ){
        # 遮罩
        next
      }
      else{
        if(m[user,tweet] > 0){
          popularityScoreMatrix[1,tweet] = popularityScoreMatrix[1,tweet] + 1
        }
      }
    }
  }

  return (popularityScoreMatrix)
}

getTopK = function(matrix, K) {
  resultIndex = c()
  for (k in 1:K){
    resultIndex[k] = order(matrix,decreasing=T)[k]
  }
  return(resultIndex)
}

getTesterAnswers = function(matrix, tester) {
  answers = matrix[tester,]
  resultIndex = c()
  for (i in 1:length(answers)){
    if(answers[i] > 0){
      resultIndex = c(resultIndex, i)
    }
    
  }
  return(resultIndex)
}

getAveragePrecision = function(numbersOfTesters, Times ,K){
  precisions = c()
  numberOfUsers = nrow(m)
  for(tester in getTesters(m, numbersOfTesters)){
    for(i in 1:Times){
      testTweet = getTestTweets(m, tester, 1)
      popularityScoreMatrix = getPopularityScoreMatrix(m, tester, testTweet)
      topK = getTopK(popularityScoreMatrix, K)
      testerAnswers = getTesterAnswers(m, tester)
      intersection = intersect(testerAnswers, topK)
      precision = length(intersection) / K
      precisions = c(precisions, precision)
    }
  }

  return(mean(precisions))
}

# ===============================================
# Input
# ===============================================

inputPath = args[1]

m = as.matrix(read.csv(inputPath, sep=",", header=FALSE))

# ===============================================
# Testing
# ===============================================

precisions = c()
for(k in 1:10){
  print(k)
  precision = getAveragePrecision(numbersOfTesters=10, Times=5, K=k)
  precisions = c(precisions, precision)
}

# ===============================================
# Plot
# ===============================================

print(precisions)
barplot(precisions, main="Popularity", xlab="P@n", ylab="precision")