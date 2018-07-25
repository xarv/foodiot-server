var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');
var RedisClient = require('../data/RedisClient');
var uuid = require('uuid/v4');

/* 
  Create the initial mapping between user and tray
   if the mapping already exists then throws error
   we create mapping in mongo and creates a new mealid if the mapping is new.
 */
router.post('/tray/:tray_id/user/:user_id', (req, res, next) => {
  DBClient.setTrayUserMapping(req.params.tray_id, req.params.user_id)
  .then( result => {
    // We create a new field for
    RedisClient.get(`active_user_${user_id}_meal`)
    .then( mealId => {
      if(mealId){
        throw new Error('active mapping already exist');
      }
    })
    .then( () => {
      RedisClient.set(`active_user_${user_id}_meal`, uuidv4()).then((redisResult) => {
        if(redisResult !== 'OK'){
          throw new Error('error with redis');
        }
        res.json(result);
      })
    })
  })
  .catch( err => {
    res.status(400).json({ error  : err.message});
  })
});

router.delete('/trayUser/:tray_id', (req, res, next) => {
  Promise.resolve()
  .then( () => DBClient.getTrayUserMapping(req.params.tray_id) )
  .then( (mapping) => mapping.user_id)
  .then( (userId) => {

    RedisClient.get( `active_user_${user_id}_meal` )
    .then( mealId => DBClient.markMealComplete( mealId, userId))
    .then( () => DBClient.deleteTrayUserMapping(req.params.tray_id))
    .then( result => {
      res.json(result);
    })
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

        DBClient.getBowlQRReaderMapping(-1, req.params.qr_reader)
        .then( mapping => {
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
  Promise.resolve.then(() => {
    return DBClient.getBowlItemMapping(bowlId)
  })
  .then( (bowlItemMapping) => {
    return bowlItemMapping.item_id;
  })
  .then( (itemId) => {
    return DBClient.getItemById(itemId)
  })
  .then( (item) => {
    RedisClient.get(`user_${user_id}_bowl_${bowlId}`)
    .then( (delta) => {
      if( delta >= 0) {
        return null;
      }
      item.delta = -delta;
      return item;
    })
    .then( (item) => {
      if(!item) {
        return 
      }
      RedisClient.get(`active_user_${user_id}_meal`)
      .then( (mealId) =>  DBClient.upsertMealForUser(mealId, userId, item) )
      .then( (result) => {

      })
    })
  })
  
}

module.exports = router;
