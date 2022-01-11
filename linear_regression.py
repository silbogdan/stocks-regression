import numpy as np
import matplotlib.pyplot as plt

y = np.array([2607.39, 2754.86, 2803.98, 2903.80, 2854.71, 2890.17, 2996.11, 2897.50, 2982.16, 2977.68, 3104.90, 3176.75, 3278.20, 3277.31, 2652.39, 2761.98, 2919.61, 3104.66, 3207.62, 3391.71, 3365.52, 3418.70, 3548.99, 3695.31, 3793.75, 3883.43, 3910.51, 4141.18, 4167.85, 4238.49, 4363.71, 4454.21, 4493.28, 4460.71, 4667.39, 4610.81]).T
x = np.array(['01-01-2019', '01-02-2019', '01-03-2019', '01-04-2019', '01-05-2019', '01-06-2019', '01-07-2019', '01-08-2019', '01-09-2019', '01-10-2019', '01-11-2019', '01-12-2019', '01-01-2020', '01-02-2020', '01-03-2020', '01-04-2020', '01-05-2020', '01-06-2020', '01-07-2020', '01-08-2020', '01-09-2020', '01-10-2020', '01-11-2020', '01-12-2020', '01-01-2021', '01-02-2021', '01-03-2021', '01-04-2021', '01-05-2021', '01-06-2021', '01-07-2021', '01-08-2021', '01-09-2021', '01-10-2021', '01-11-2021', '01-12-2021']).T
yCopy = np.copy(y)

plt.scatter(range(x.size), y)

onesArr = np.ones((x.shape[0], 1))
A = np.column_stack((onesArr, range(x.size)))
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
    tau = tau / beta[k]
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

# Anticipam pe un anumit interval
for val in range(36):
    newY = np.append(newY, val * c[1] + c[0])

plt.plot(range(36), newY)

print("Simple error: " + str(getError(yCopy, newY)))
print("R squared error: " + str(getRSquaredError(yCopy, newY)))

plt.xticks(rotation=60)
plt.show()