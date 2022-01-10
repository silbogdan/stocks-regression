import numpy as np
import matplotlib.pyplot as plt

x = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).T
y = np.array([4204.11, 4297.50, 4395.26, 4522.68, 4307.54, 4605.38, 4567.00, 4766.18, 4700.58, 4704.01]).T
yCopy = np.copy(y)

plt.scatter(x, y)

onesArr = np.ones((x.shape[0], 1))

A = np.column_stack((onesArr, x))
print(A)

m, n = A.shape

def TORT (A):
    U = np.zeros((m, n))
    p = min(m-1, n)
    beta = np.zeros((p, 1))
    for k in range(p):
        # Calcularea lui sigma
        s = 0
        for i in range(k, m):
            s = s + A[i, k]**2
        sigma = np.sign(A[k, k]) * np.sqrt(s)
        
        if sigma != 0:
            # Calcularea vectorilor householder
            U[k, k] = A[k, k] + sigma
            for i in range(k+1, m):
                U[i, k] = A[i, k]            
            beta[k] = sigma * U[k, k]

            # Aplicarea reflectorului Householder pe A
            for j in range(k,n):
                tau = 0
                for q in range(k, m):
                    tau = tau + U[q, k] * A[q, j]
                tau = tau / beta[k]
                for i in range(k, m):
                    A[i, j] = A[i, j] - tau * U[i, k]
                    
    return U, A, beta

def Utris(U, b):
    n = len(U)
    x = np.zeros((n, 1))
    for i in range(n-1, -1, -1):
        s = b[i]
        for j in range(i+1, n):
            s = s - U[i][j]*x[j]
        x[i] = s / U[i][i]
    return x

U, R, beta = TORT(A)

for k in range(n):
    tau = 0
    for i in range(k, m):
        tau = tau + U[i,k] * y[i]
    tau =tau / beta[k]
    for i in range(k, m):
        y[i] = y[i] - tau * U[i,k]

# Calcularea erorii
def getError(initVec, finalVec):
    return np.sqrt(sum((finalVec[0:initVec.size] - initVec) ** 2)) / (initVec.size - 2)

def getRSquaredError(initVec, finalVec):
    meanY = np.zeros(initVec.size) # Vector de comparatie: are media lui initVec pe fiecare pozitie
    for i in range(initVec.size):
        meanY[i] = np.mean(initVec)
    
    err = sum((finalVec[0:initVec.size] - initVec) ** 2) # Eroarea simpla
    meanErr = sum((meanY - initVec) ** 2) # Eroarea medie

    return 1 - (err / meanErr)
    

c = Utris(R[0:n,:], y[0:n])
print(c)

newY = np.array([])

for val in range(20):
    print("Val " + str(val) + ": " + str(val * c[1] + c[0]))
    newY = np.append(newY, val * c[1] + c[0])

plt.plot(range(20), newY)

print("Simple error: " + str(getError(yCopy, newY)))
print("R squared error: " + str(getRSquaredError(yCopy, newY)))

plt.show()