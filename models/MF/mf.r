#!/usr/bin/Rscript
args<-commandArgs(TRUE)

# ===============================================
# Functions
# ===============================================

matrix_factorization = function(M, P, Q, K, steps, alpha, beta){
  Q = t(Q)

  mu = mean(m)
  for(step in 1:steps){
    for(i in 1:nrow(M)){
      for(j in 1:ncol(M)){
        if(M[i,j] > 0){
          # bias
          eij = M[i,j] - (P[i,] %*% Q[,j]) - mu - (mean(m[i,])-mu) - (mean(m[,j])-mu)
          P[i,] = P[i,] + alpha * (2 * eij * Q[,j] - beta * P[i,])
          Q[,j] = Q[,j] + alpha * (2 * eij * P[i,] - beta * Q[,j])
        }
      }
    }
    e = 0
    for(i in 1:nrow(M)){
      for(j in 1:ncol(M)){
        if(M[i,j] > 0){
          # bias
          e = e + ( M[i,j] - mu - (mean(m[i,])-mu) - (mean(m[,j])-mu) - P[i,] %*% Q[,j] )^2
          for(k in 1:K){
            e = e + (beta / 2) * ( P[i,k]^2 + Q[k,j]^2 + mean(m[i,])^2 + mean(m[,j])^2 ) 
          }
        }
      }
    }
    if(e < 0.001){
      # write.table(P %*% Q,file="results/results.csv", row.names=FALSE, col.names=FALSE, sep=",", na="") # keeps the rownames
      break
    }
    else{
      print(step)
      print(e)
      write.table(P %*% Q,file=outputPath, row.names=FALSE, col.names=FALSE, sep=",", na="") # keeps the rownames
    }
  }
  # print(P %*% Q)
}

# ===============================================
# Input
# ===============================================

inputPath = args[1]
outputPath = args[2]
m = as.matrix(read.csv(inputPath, sep=",", header=FALSE))

K = 15
P = matrix(rnorm(nrow(m)*K,mean=1,sd=0.5), nrow = nrow(m), ncol=K)
Q = matrix(rnorm(ncol(m)*K,mean=1,sd=0.5), nrow = ncol(m), ncol=K)

matrix_factorization(M = m, P, Q, K, steps = 5000 , alpha = 0.002, beta =0.001)