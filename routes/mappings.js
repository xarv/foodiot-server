var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');
var RedisClient = require('../data/RedisClient');

/* GET users listing. */
router.post('/tray/:tray_id/user/:user_id', (req, res, next) => {
  DBClient.setTrayUserMapping(req.params.tray_id, req.params.user_id).then( result => {
    res.json(result);
  })
  .catch( err => {
    res.status(400).json({ error  : err.message});
  })
});

router.delete('/trayUser/:tray_id', (req, res, next) => {
  DBClient.deleteTrayUserMapping(req.params.tray_id).then( result => {
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

router.delete('/bowlQrReader/:bowl_id', (req, res, next) => {
  DBClient.deleteBowlQRReaderMapping(req.params.bowl_id).then( result => {
    res.json(result);
  })
  .catch( err => {
    res.status(400).json({ error  : err.message});
  })
} );

router.post( '/bowl/:bowl_id/item/:item_id', ( req, res, next ) => {
  DBClient.setBowlItemMapping( req.params.bowl_id, req.params.item_id ).then( result => {
    res.json( result );
  } )
    .catch( err => {
      res.status( 400 ).json( { error: err.message } );
    } )
} )

router.delete( '/bowlItem/:bowl_id', ( req, res, next ) => {
  DBClient.deleteBowlItemMapping( req.params.bowl_id ).then( result => {
    res.json( result );
  } )
    .catch( err => {
      res.status( 400 ).json( { error: err.message } );
    } )
} );
// /mappings/tray/:id/ Scanner calls it
router.post('/tray/:tray_id/qrReader/:qr_reader', (req, res, next ) => {

  DBClient.getTrayUserMapping(res.params.tray_id).then( results => {
    // We get user
    var trayUserMapping = results;

    if( !trayUserMapping ) {
      res.status( 400 ).json( { error: 'invalid tray id' } );
    }

    // Redis Key which maintains which was the last user assigned to the qr reader
    var redisKey = `qr_reader_${req.params.qr_reader}_user`;

    RedisClient.get(redisKey).then( result => {
      if(!result){
        // the mapping didn't exist : no user came till now on this qr reader
        RedisClient.set(redisKey, trayUserMapping.user_id).then( result => {
          if(result === 'OK') {
            res.status(200).json( { status: result } )
          }
        })
      }
      else {
        // If the mapping existed but the request user and redis user is same, we do not update the mapping and return with success
        if( trayUserMapping.user_id.toString() === result.toString()  ) {
          return res.status(200).json( { status: 'ok' } )
        }

        // if the request user is different we update the mapping in redis and 
        // for my result user_id i need to add the item quantity to meals item array
        // TODO
        // Query Bowl 

        DBClient.getBowlQRReaderMapping(-1, req.params.qr_reader).then( mapping => {
          if(!mapping) res.status( 400 ).json( { error: 'invalid qr id' } );
          var bowlId = mapping.bowl_id;
          completeUserBowlDelivery(bowlId, trayUserMapping.user_id);
        })
        .then( () => {
          RedisClient.set(redisKey, trayUserMapping.user_id).then( result => {
            if(result === 'OK') {
              res.status(200).json( { status: result } )
            }
          })
        })
      }
    })
    
  });
});

function completeUserBowlDelivery(bowlId, userId){
  // TODO : Redis Key is `user_${user_id}_bowl_${bowlId}`

}

module.exports = router;
