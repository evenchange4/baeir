#!/usr/bin/Rscript
args<-commandArgs(TRUE)

# ===============================================
# Functions
# ===============================================
getTopK = function(matrix, tester, K) {
  resultIndex = c()
  for (k in 1:K){
    resultIndex[k] = order(matrix[tester,],decreasing=T)[k]
  }
  return(resultIndex)
}

otuput = function(path, matrix, K) {
  n_users = nrow(matrix)
  outputMatrix = matrix(0, nrow=n_users, ncol=K)
  for (i in 1:n_users) {
    topK = getTopK(matrix, i, K)
    outputMatrix[i,] = topK
  }
  return (outputMatrix)
}

matrix_factorization = function(matrix, nfeature, steps, alpha, beta) {
  # to Matrix
  n_users = max(trainSet[,'V1'])
  n_tweets = max(trainSet[,'V2'])
  n_trainSet = length(trainSet[,'V1'])

  matrix_trainSet = matrix(0, nrow=n_users, ncol=n_tweets)

  for (i in 1:n_trainSet) {
    user  = trainSet[i,'V1']
    tweet = trainSet[i,'V2']
    value = trainSet[i,'V3']
    matrix_trainSet[user,tweet] = value
  }

  # model

  matrix_nrow = max(matrix[,1])
  matrix_ncol = max(matrix[,2])

  P = matrix(rnorm(matrix_nrow*nfeature, mean=1, sd=0.5), nrow=matrix_nrow, ncol=nfeature)
  Q = matrix(rnorm(matrix_ncol*nfeature, mean=1, sd=0.5), nrow=matrix_ncol, ncol=nfeature)
  Q = t(Q)

  for(step in 1:steps){
    for (row in 1:nrow(matrix)){
      i = matrix[row,1]
      j = matrix[row,2]
      value = matrix[row,3] - mean(matrix_trainSet[i,]) - mean(matrix_trainSet[,j])

      # Explicit Features
      t_text_length = matrix[row,4]
      t_mention_counts = matrix[row,5]
      t_url_counts = matrix[row,6]
      t_expression_counts = matrix[row,7]
      t_topic_counts = matrix[row,8]
      t_isgeo = matrix[row,9]
      t_image = matrix[row,10]
      u_tweet_counts = matrix[row,11]
      u_retweet_counts = matrix[row,12]
      u_retweeted_counts = matrix[row,13]
      u_mention_counts = matrix[row,14]
      u_mentioned_counts = matrix[row,15]
      u_url_counts = matrix[row,16]
      u_expression_counts = matrix[row,17]
      u_topic_counts = matrix[row,18]
      u_geo_counts = matrix[row,19]

      # bias = t_text_length / 100 + t_mention_counts + t_url_counts + t_expression_counts + t_topic_counts + t_isgeo + t_image + u_tweet_counts + u_retweet_counts + u_retweeted_counts + u_mention_counts + u_mentioned_counts + u_url_counts + u_expression_counts + u_topic_counts + u_geo_counts

      bias = 0

      eij = value - (P[i,] %*% Q[,j]) + bias
      P[i,] = P[i,] + alpha * (2*eij*Q[,j] - beta*P[i,])
      Q[,j] = Q[,j] + alpha * (2*eij*P[i,] - beta*Q[,j])
    }
    e = 0
    for (row in 1:nrow(matrix)) {
      i = matrix[row,1]
      j = matrix[row,2]
      value = matrix[row,3] - mean(matrix_trainSet[i,]) - mean(matrix_trainSet[,j])

      # Explicit Features
      t_text_length = matrix[row,4]
      t_mention_counts = matrix[row,5]
      t_url_counts = matrix[row,6]
      t_expression_counts = matrix[row,7]
      t_topic_counts = matrix[row,8]
      t_isgeo = matrix[row,9]
      t_image = matrix[row,10]
      u_tweet_counts = matrix[row,11]
      u_retweet_counts = matrix[row,12]
      u_retweeted_counts = matrix[row,13]
      u_mention_counts = matrix[row,14]
      u_mentioned_counts = matrix[row,15]
      u_url_counts = matrix[row,16]
      u_expression_counts = matrix[row,17]
      u_topic_counts = matrix[row,18]
      u_geo_counts = matrix[row,19]

      bias = 0

      e = e + ( value - P[i,] %*% Q[,j] + bias)^2
      for(k in 1:nfeature){
        e = e + (beta / 2) * ( P[i,k]^2 + Q[k,j]^2 + bias^2) 
      }
    }
    print(e)
    outputMatrix = otuput(outputPath, P %*% Q, K=20)
    write.table(outputMatrix,file=outputPath, row.names=FALSE, col.names=FALSE, sep=" ", na="")
    # write.table(P %*% Q,file=outputPath, row.names=FALSE, col.names=FALSE, sep=",", na="") # keeps the rownames
  }
}


# ===============================================
# Input
# ===============================================

trainSetPath = args[1]
outputPath = args[2]

trainSet = as.matrix(read.csv(trainSetPath, sep=" ", header=FALSE))

matrix_factorization(matrix=trainSet, nfeature=30, steps=5000, alpha=0.0001, beta=0.00002)