#!/usr/bin/Rscript
args<-commandArgs(TRUE)

# ===============================================
# Input
# ===============================================

inputPath = args[1]
outputPath = args[2]

m = as.matrix(read.csv(inputPath, sep=",", header=FALSE))

s = svd(m)

r = s$u %*% diag(s$d) %*% t(s$v)

write.table(r,file=outputPath, row.names=FALSE, col.names=FALSE, sep=",", na="")

print(r)