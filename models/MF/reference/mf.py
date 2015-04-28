#!/usr/bin/python
#
# Created by Albert Au Yeung (2010)
#
# An implementation of matrix factorization
#
try:
    import numpy
    import sys
except:
    print "This implementation requires the numpy module."
    exit(0)

###############################################################################

"""
@INPUT:
    R     : a matrix to be factorized, dimension N x M
    P     : an initial matrix of dimension N x K
    Q     : an initial matrix of dimension M x K
    K     : the number of latent features
    steps : the maximum number of steps to perform the optimisation
    alpha : the learning rate
    beta  : the regularization parameter
@OUTPUT:
    the final matrices P and Q
"""
def matrix_factorization(R, P, Q, K, steps=5000, alpha=0.0002, beta=0.02):
    Q = Q.T
    for step in xrange(steps):
        print(step)
        for i in xrange(len(R)):
            for j in xrange(len(R[i])):
                if R[i][j] > 0:
                    eij = R[i][j] - numpy.dot(P[i,:],Q[:,j])
                    for k in xrange(K):
                        P[i][k] = P[i][k] + alpha * (2 * eij * Q[k][j] - beta * P[i][k])
                        Q[k][j] = Q[k][j] + alpha * (2 * eij * P[i][k] - beta * Q[k][j])
        # eR = numpy.dot(P,Q)
        e = 0
        for i in xrange(len(R)):
            for j in xrange(len(R[i])):
                if R[i][j] > 0:
                    e = e + pow(R[i][j] - numpy.dot(P[i,:],Q[:,j]), 2)
                    for k in xrange(K):
                        e = e + (beta/2) * ( pow(P[i][k],2) + pow(Q[k][j],2) )
        print(e)
        if e < 0.001:
            break
    return P, Q.T, step

###############################################################################

if __name__ == "__main__":
    #### read matrix.csv
    R = []
    filePath = sys.argv[1]
    f = open(filePath, 'r')
    for line in f:
        temp = []
        for e in line.split('\n')[0].split(','):
            temp.append(float(e))
        R.append(temp)
    ###

    R = numpy.array(R)
    print(R[1])

    N = len(R)
    M = len(R[0])

    K = 25

    P = numpy.random.rand(N,K)
    Q = numpy.random.rand(M,K)

    nP, nQ, step= matrix_factorization(R, P, Q, K, steps=5000, alpha=0.03, beta=0.02)
    nR = numpy.dot(nP, nQ.T)
    print(step)
    print(R)
    print(nR)
