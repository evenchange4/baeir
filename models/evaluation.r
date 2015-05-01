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


getAveragePrecision = function(resultMatrix, answerMatrix, K){
  precisions = c()

  numberOfUsers = nrow(resultMatrix)
  print(numberOfUsers)
  for(user in 1:numberOfUsers){
    answers = getTesterAnswers(answerMatrix, user)
    topK = getTopK(resultMatrix, user ,K)
    intersection = intersect(answers, topK)
    precision = length(intersection) / K
    precisions = c(precisions, precision)
    # print(answers)
    # print(topK)
    # print(intersection)
  }

  return(mean(precisions))
}

# ===============================================
# Input
# ===============================================

resultPath = args[1]
answerPath = args[2]

resultMatrix = as.matrix(read.csv(resultPath, sep=",", header=FALSE))
answerMatrix = as.matrix(read.csv(answerPath, sep=",", header=FALSE))

precisions = c()
for(k in 1:20){
  print(k)
  precision = getAveragePrecision(resultMatrix, answerMatrix, k)
  precisions = c(precisions, precision)
}

# ===============================================
# Plot
# ===============================================

print(precisions)
barplot(precisions, main="Precision @ topK", xlab="P@n", ylab="precision")