var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');

/* GET users listing. */
router.get('/list', function(req, res, next) {
  DBClient.getUsers().then( results => {
    res.json(results);
  })
});

module.exports = router;
