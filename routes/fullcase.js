var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/:caseId', function(req, res, next) {

  if ( !req.params.caseId ) {
    next();
  }

  if ( !req.query.full_text || req.query.full_text == true) {
    res.render('fullcase', { 
      id: req.params.caseId,
      fullText: true,
      authToken: req.query.token
    });
  } else {
    res.render('fullcase', { 
      id: req.params.caseId,
      fullText: false,
      authToken: req.query.token
    });
  }
});

module.exports = router;