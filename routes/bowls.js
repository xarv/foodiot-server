var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');
var RedisClient = require('../data/RedisClient');

/* GET users listing. */
router.get('/list', function(req, res, next) {
  DBClient.getBowls().then( results => {
    res.json(results);
  })
});

router.get('/:id', (req, res, next) => {
  DBClient.getBowlById(req.params.id).then( result => {
    res.json(result);
  })
})

router.post('/:bowl_id/delta/:delta', ( req, res, next ) => {
  var delta = parseFloat(req.params.delta);
  delta = Math.round(delta)
  delta = parseInt(delta)

  bowlId = parseInt(req.params.bowl_id);

  DBClient.getBowlQRReaderMapping(bowlId, -1).then( mapping => {
    var qrReaderId = mapping.qr_reader_id;

    var redisKey = `qr_reader_${qrReaderId}_user`
    
    RedisClient.get(redisKey).then( user_id => {
      if(!user_id){
        return res.status( 500 ).json( { error: 'something went wrong' } );
      }
      var userItemRedisKey = `user_${user_id}_bowl_${bowlId}`;

      RedisClient.get(userItemRedisKey).then( value => {
        RedisClient.set(userItemRedisKey, delta + (parseInt(value) || 0)).then(result => {
          if(result === 'OK') {
            return res.json({ status : result})
          }
          res.status(500).json({ error: 'something went wrong' })
        })
      })
    });
  })  
})

module.exports = router;
