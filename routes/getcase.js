var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/:caseId', function(req, res, next) {

	if ( !req.params.caseId ) {
    next();
  }

  var caseUrl = 'https://api.case.law/v1/cases/';
  caseUrl += req.params.caseId;
  //caseUrl += '/?body_format=html';

  if( req.query.full_text == "true" ) {
    caseUrl += '?full_case=true';
  }

  console.log("Finding case at following URL: " + caseUrl);

  var options = {
      method: 'GET',
      uri: encodeURI(caseUrl),
      json: true
  };

  if( req.query.key ) {
    options.headers = { 'Authorization': 'Token '+ req.query.key };
  }

  console.log(options);


	request( options, (caperr, capres, capdata) => {
    	if (caperr) {
      		console.log('Error:', caperr);
    	} else if (capres.statusCode !== 200) {
      		console.log('Status:', capres);
    	} else {
      		// data is already parsed as JSON:
      		console.log(capdata);
          console.log("Case data sent...");
      		res.send(capdata);
    	}
	});
});

module.exports = router;