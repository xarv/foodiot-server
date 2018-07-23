var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');

/* GET users listing. */
router.get('/tray/:tray_id/user/:user_id', function(req, res, next) {
  DBClient.setTrayUserMapping(req.params.tray_id, req.params.user_id).then( result => {
    res.json(result);
  })
  .catch( err => {
    res.status(400).json({ error  : err.message});
  })
});


module.exports = router;
