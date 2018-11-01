var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if ( !req.query.key ) {
    res.render('federal-cases', { 
      "key": ''
    });
  } else {
    res.render('federal-cases', { 
      "key": req.query.key
    });
  }
});

module.exports = router;