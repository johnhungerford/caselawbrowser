var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if ( !req.query.key ) {
    	res.render('index', { 
      		"key": ''
    	});
  	} else {
    	res.render('index', { 
      		"key": req.query.key
   		});
  	}
});

module.exports = router;
