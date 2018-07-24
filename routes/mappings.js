var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');

/* GET users listing. */
router.post('/tray/:tray_id/user/:user_id', (req, res, next) => {
  DBClient.setTrayUserMapping(req.params.tray_id, req.params.user_id).then( result => {
    res.json(result);
  })
  .catch( err => {
    res.status(400).json({ error  : err.message});
  })
});

router.post('/bowl/:bowl_id/qrReader/:qr_reader_id', (req, res, next) => {
  DBClient.setBowlQRReaderMapping(req.params.bowl_id, req.params.qr_reader_id).then( result => {
    res.json(result);
  })
  .catch( err => {
    res.status(400).json({ error  : err.message});
  })
} )

router.post( '/bowl/:bowl_id/item/:item_id', ( req, res, next ) => {
  DBClient.setBowlItemMapping( req.params.bowl_id, req.params.item_id ).then( result => {
    res.json( result );
  } )
    .catch( err => {
      res.status( 400 ).json( { error: err.message } );
    } )
} )


module.exports = router;
