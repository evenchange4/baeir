#!/usr/bin/Rscript
args<-commandArgs(TRUE)

# ===============================================
# Functions
# ===============================================

matrix_factorization = function(matrix, nfeature, steps, alpha, beta) {
  matrix_nrow = max(matrix[,1])
  matrix_ncol = max(matrix[,2])

  P = matrix(rnorm(matrix_nrow*nfeature, mean=1, sd=0.5), nrow=matrix_nrow, ncol=nfeature)
  Q = matrix(rnorm(matrix_ncol*nfeature, mean=1, sd=0.5), nrow=matrix_ncol, ncol=nfeature)
  Q = t(Q)

  for(step in 1:steps){
    for (row in 1:nrow(matrix)){
      i = matrix[row,1]
      j = matrix[row,2]
      value = matrix[row,3]

      eij = value - (P[i,] %*% Q[,j])
      P[i,] = P[i,] + alpha * (2*eij*Q[,j] - beta*P[i,])
      Q[,j] = Q[,j] + alpha * (2*eij*P[i,] - beta*Q[,j])
    }
    e = 0
    for (row in 1:nrow(matrix)) {
      i = matrix[row,1]
      j = matrix[row,2]
      value = matrix[row,3]

      e = e + ( value - P[i,] %*% Q[,j] )^2
      for(k in 1:nfeature){
        e = e + (beta / 2) * ( P[i,k]^2 + Q[k,j]^2 ) 
      }
    }
    print(e)
    write.table(P %*% Q,file=outputPath, row.names=FALSE, col.names=FALSE, sep=",", na="") # keeps the rownames
  }
}

# ===============================================
# Input
# ===============================================

inputPath = args[1]
outputPath = args[2]
matrix = as.matrix(read.csv(inputPath, sep=",", header=FALSE))

matrix_factorization(matrix=matrix, nfeature=30, steps=5000, alpha=0.001, beta=0.00002)