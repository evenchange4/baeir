#!/usr/bin/Rscript
args<-commandArgs(TRUE)

# ===============================================
# Functions
# ===============================================

getSVD = function(n_ignore, matrix_trainSet) {
  svdresults = svd(matrix_trainSet, nu=min(nrow(matrix_trainSet), ncol(matrix_trainSet)), nv = min(nrow(matrix_trainSet), ncol(matrix_trainSet)), LINPACK = F)

  # ================= 
  #创建初始值为0矩阵，用来从svd的参数中还原原矩阵  
  svd2matrix <- matrix(0, nrow=nrow(matrix_trainSet), ncol=ncol(matrix_trainSet))   

  # ================= 
  #可以尝试略去一些奇异值较小的项  
  ignorenum <- n_ignore  #设置去掉一些最小奇异值的个数  
  for (i in 1:(length(svdresults$d) - ignorenum))  
  {  
    svd2matrix <- svd2matrix + svdresults$d[i] * as.matrix(svdresults$u[, i]) %*% t(as.matrix(svdresults$v[, i]))   
  }  

  # ================= 
  # 求平均绝对偏差，通过平均绝对偏差来衡量整体信息的还原程度  
  colME <- NULL      
  for (j in 1:length(svdresults$d))  
  {  
    #求每一列的绝对偏差的和  
    colME <- c(colME, sum(abs(svd2matrix[, j] - matrix_trainSet[, j])))  
  }  

  # ================= 
  #根据每一列总和来计算平均绝对偏差  
  meanME <- sum(colME) / (nrow(matrix_trainSet) * ncol(matrix_trainSet))  
  print(meanME)

  return (svd2matrix)
}

getRMSE = function(testSet, matrix_svdResult){
  n_testSet = length(testSet[,'V1'])

  RMSE_matrix = matrix(0, nrow=n_testSet, ncol=2)
  colnames(RMSE_matrix) <- c('y', 'y_pred')
  for (i in 1:n_testSet) {
    user  = testSet[i,'V1']
    tweet = testSet[i,'V2']
    value = testSet[i,'V3']
    RMSE_matrix[i,'y'] = value
    RMSE_matrix[i,'y_pred'] = matrix_svdResult[user, tweet]
  }
  RMSE <- sqrt(mean((RMSE_matrix[,'y']- RMSE_matrix[,'y_pred'])^2))

  return (RMSE)
}

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
    # print(topK)
    # output
  }
  return (outputMatrix)
}
# ===============================================
# Input
# ===============================================

trainSetPath = args[1]
testSetPath = args[2]
outputPath = args[3]

trainSet = as.matrix(read.csv(trainSetPath, sep=" ", header=FALSE))
testSet = as.matrix(read.csv(testSetPath, sep=" ", header=FALSE))

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

matrix_svdResult = getSVD(20, matrix_trainSet)

RMSE = getRMSE(testSet, matrix_svdResult)

print(RMSE)

outputMatrix = otuput(outputPath, matrix_svdResult, K=20)

write.table(outputMatrix,file=outputPath, row.names=FALSE, col.names=FALSE, sep=" ", na="")
