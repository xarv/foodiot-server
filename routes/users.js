var express = require('express');
var router = express.Router();
var DBClient = require('../data/DBClient');

/* GET users listing. */
router.get('/list', function(req, res, next) {
  DBClient.getUsers().then( results => {
    res.json(results);
  })
});

router.get('/:id', (req, res, next) => {
  DBClient.getUserByID(req.params.id).then( result => {
    res.json(result);
  })
})

router.post('/signup', (req, res, next) => {
	var userObj = req.body.user;
	userObj["bmi"] = (parseInt(userObj.weight)/Math.pow((parseInt(userObj.height)/100),2)).toFixed(2);
	console.log("user obj", userObj);
  DBClient.addUser(userObj).then( result => {
    res.json({message:"succeded"});
  }, (err) => {
  	res.json({message:"failed", reason: err})
  })
})

router.get('/:id/getMeals', (req, res, next) => {
  var userId = parseInt(req.params.id)

  DBClient.getMealsForUser( userId ).then( meals => {
    console.log(meals)
    res.json(meals);
  })
  .catch( err => {
    console.log(err);
    res.status(500).json( { err: 'something went wrong' } )
  })
})

module.exports = router;
