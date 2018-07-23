var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');

/* GET users listing. */
router.post('/credit/:id', function(req, res, next) {
  DBClient.getBalanceObject(req.params.id).then(result => {
    // TODO: Update Balance
    res.json(result)
  })
})
  
/* params :
    walletTransaction : WalletTransaction object 
*/
function updateWalletTransactions (walletTransaction) {
  DBClient.updateWalletTransactions(walletTransaction).then(result => {
    
  });
}
  
function WalletTransaction(id, amount, type, merchantName) {
  this.id = id;
  this.amount = amount;
  this.type = type;
  this.merchantName = merchantName;
}

module.exports = router;
