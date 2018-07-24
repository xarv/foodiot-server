var DBClient = require('../data/DBClient');

/* Service for credit debit wallet */

const walletService = {
    creditMoney : (amount, userId) => {
        var walletTransactionObject = {
            id: userId,
            amount: amount,
            type: "credit",
            merchantName: "Celebrations", 
        }
        return DBClient.updateWalletTransactions(walletTransactionObject)
            .then(result => result)
            .then((result) =>  DBClient.getBalance(userId))
            .then((result) => {
                console.log("balance is ", result)
                return new Promise((resolve, reject) => {
                    DBClient.updateBalance(userId, amount + result.balance)
                    .then(result => {
                        resolve(result)
                    }, (err) => {
                        reject(err)                                        
                    })
                })
            }, (err) => {
                throw new Error("Unable to get balance")
            })
    },
    debitMoney : (amount, userId, merchantName) => {
        var walletTransactionObject = {
            id: userId,
            amount: amount,
            type: "debit",
            merchantName: merchantName, 
        }
        return DBClient.updateWalletTransactions(walletTransactionObject)
            .then(result => result)
            .then((result) =>  DBClient.getBalance(userId))
            .then((result) => {
                console.log("balance is ", result)
                return new Promise((resolve, reject) => {
                    DBClient.updateBalance(userId, result.balance - amount)
                    .then(result => {
                        resolve(result)
                    }, (err) => {
                        reject(err)                                        
                    })
                })
            }, (err) => {
                throw new Error("Unable to get balance")
            })
    }
}

  

module.exports = walletService;
