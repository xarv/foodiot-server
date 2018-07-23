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
  

module.exports = router;
