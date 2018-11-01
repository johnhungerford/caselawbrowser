var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/:caseId', function(req, res, next) {

  if ( !req.params.caseId ) {
    next();
  }

  var renderParams = { id: req.params.caseId };

  if( !req.query.full_text || req.query.fulltext == true ) {
    renderParams.fullText = true;
  } else {
    renderParams.fullText = false;
  }

  if ( !req.query.key ) {
    renderParams.key = '';
  } else {
    renderParams.key = req.query.key;
  }

  res.render('fullcase', renderParams );
 
});

module.exports = router;