import numpy as np
import matplotlib.pyplot as plt

from flask import Flask, request
app = Flask(__name__)

def TORT (A, m, n):
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

def getError(initVec, finalVec):
    return np.sqrt(sum((finalVec[0:initVec.size] - initVec) ** 2)) / (initVec.size - 2)

def getRSquaredError(initVec, finalVec):
    meanY = np.zeros(initVec.size) # Vector de comparatie: are media lui initVec pe fiecare pozitie
    for i in range(initVec.size):
        meanY[i] = np.mean(initVec)
    
    err = sum((finalVec[0:initVec.size] - initVec) ** 2) # Eroarea simpla
    meanErr = sum((meanY - initVec) ** 2) # Eroarea medie

    return 1 - (err / meanErr)

@app.route("/")
def hello():
    resData = request.json
    x = np.array([])
    y = np.array([])
    for stick in resData["values"]:
        x = np.append(x, str(stick[0]))
        y = np.append(y, stick[4])
    yCopy = np.copy(y)
    onesArr = np.ones((x.shape[0], 1))
    A = np.column_stack((onesArr, range(x.size)))
    m, n = A.shape
    U, R, beta = TORT(A, m, n)

    for k in range(n):
        tau = 0
    for i in range(k, m):
        tau = tau + U[i,k] * y[i]
    tau = tau / beta[k]
    for i in range(k, m):
        y[i] = y[i] - tau * U[i,k]

    c = Utris(R[0:n,:], y[0:n])
        
    newY = np.array([])

    for val in range(yCopy.size + resData["predictionTime"]):
        newY = np.append(newY, val * c[1] + c[0])


    # return {"dates": x.tolist(), "closingPrices": y.tolist()}
    return {"prediction": newY.tolist(), "initialSize": yCopy.size, "finalSize": newY.size}

    