#!/usr/bin/Rscript

matrix_factorization = function(M, P, Q, K, steps, alpha, beta){
  Q = t(Q)

  mu = mean(m)

  for(step in 1:steps){
    for(i in 1:nrow(M)){
      for(j in 1:ncol(M)){
        if(M[i,j] >= 0){
          # bias
          eij = M[i,j] - (P[i,] %*% Q[,j]) - mu - (mean(m[i,])-mu) - (mean(m[,j])-mu)
          P[i,] = P[i,] + alpha * (2 * eij * Q[,j] - beta * P[i,])
          Q[,j] = Q[,j] + alpha * (2 * eij * P[i,] - beta * Q[,j])
        }
      }
    e = 0
    } 
    for(i in 1:nrow(M)){
      for(j in 1:ncol(M)){
        if(M[i,j] >= 0){
          # bias
          e = e + ( M[i,j] - mu - (mean(m[i,])-mu) - (mean(m[,j])-mu) - P[i,] %*% Q[,j] )^2
          for(k in 1:K){
            e = e + (beta / 2) * ( P[i,k]^2 + Q[k,j]^2 + mean(m[i,])^2 + mean(m[,j])^2 ) 
          }
        }
      }
    }
    print(step)
    print(e)
    write.table(P %*% Q,file="results/results.csv", row.names=FALSE, col.names=FALSE, sep=",", na="") # keeps the rownames
    if(e < 0.0001){
      # write.table(P %*% Q,file="results/results.csv", row.names=FALSE, col.names=FALSE, sep=",", na="") # keeps the rownames
      break
    }
  }
  # print(P %*% Q)
}

m = as.matrix(read.csv("relations 3.csv", sep=",", header=FALSE))
# m = as.matrix(read.csv("reference/matrix.csv", sep=",", header=FALSE))

K = 5
P = matrix(rnorm(nrow(m)*K,mean=1,sd=0.5), nrow = nrow(m), ncol=K)
Q = matrix(rnorm(ncol(m)*K,mean=1,sd=0.5), nrow = ncol(m), ncol=K)

matrix_factorization(M = m, P, Q, K, steps = 5000 , alpha = 0.002, beta =0.002)

# (steps = 100 , alpha = 0.02, beta =0.02) K = 6 4039.817
# (steps = 100 , alpha = 0.02, beta =0.02) K = 7 3976.073
# (steps = 100 , alpha = 0.02, beta =0.02) K = 8 3916.379
# (steps = 100 , alpha = 0.02, beta =0.02) K = 9 3876.821
# (steps = 100 , alpha = 0.02, beta =0.02) K =10 3851.721