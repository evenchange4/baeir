#!/usr/bin/Rscript

matrix_factorization = function(M, P, Q, K, steps, alpha, beta){
  Q = t(Q)
  for(step in 1:steps){
    for(i in 1:nrow(M)){
      for(j in 1:ncol(M)){
        if(M[i,j] >= 0){
          eij = M[i,j] - (P[i,] %*% Q[,j])
          P[i,] = P[i,] + alpha * (2 * eij * Q[,j] - beta * P[i,])
          Q[,j] = Q[,j] + alpha * (2 * eij * P[i,] - beta * Q[,j])
        }
      }
    e = 0
    } 
    for(i in 1:nrow(M)){
      for(j in 1:ncol(M)){
        if(M[i,j] >= 0){
          e = e + ( M[i,j] - P[i,] %*% Q[,j] )^2
          for(k in 1:K){
            e = e + (beta / 2) * ( P[i,k]^2 + Q[k,j]^2 ) 
          }
        }
      }
    }
    print(step)
    print(e)
    if(e < 0.0001){
      break
    }
  }
  # print(P %*% Q)
}

m = as.matrix(read.csv("relations 2.csv", sep=",", header=FALSE))
# m = as.matrix(read.csv("matrix.csv", sep=",", header=FALSE))

K = 10
P = matrix(rnorm(nrow(m)*K,mean=1,sd=0.5), nrow = nrow(m), ncol=K)
Q = matrix(rnorm(ncol(m)*K,mean=1,sd=0.5), nrow = ncol(m), ncol=K)

matrix_factorization(M = m, P, Q, K, steps = 100 , alpha = 0.02, beta =0.02)

# (steps = 100 , alpha = 0.02, beta =0.02) K = 6 4039.817
# (steps = 100 , alpha = 0.02, beta =0.02) K = 7 3976.073
# (steps = 100 , alpha = 0.02, beta =0.02) K = 8 3916.379
# (steps = 100 , alpha = 0.02, beta =0.02) K = 9 3876.821
# (steps = 100 , alpha = 0.02, beta =0.02) K =10 3851.721