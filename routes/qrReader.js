var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');

/* GET users listing. */
router.get('/list', function(req, res, next) {
  DBClient.getQRReaders().then( results => {
    res.json(results);
  })
});

router.get('/:id', (req, res, next) => {
  DBClient.getQRReaderById(req.params.id).then( result => {
    res.json(result);
  })
})

module.exports = router;
