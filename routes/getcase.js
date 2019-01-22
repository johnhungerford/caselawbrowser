var express = require('express');
var request = require('request');
var router = express.Router();
var dxg = require('capdocxgen');
var docx = require('docx');
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/:caseId', function(req, res, next) {

	if ( !req.params.caseId ) {
    next();
  }

  var caseUrl = 'https://api.case.law/v1/cases/';
  caseUrl += req.params.caseId;
  caseUrl += '/?body_format=xml';

  if( req.query.full_text == "true" ) {
    caseUrl += '&full_case=true';
    if( req.query.body_format == 'html') {
      caseUrl += '&body_format=html';
    }
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

/* GET home page. */
router.get('/:caseId/docx', function(req, res, next) {

  console.log('trying to get file!!');

  if ( !req.params.caseId ) {
    next();
  }

  var caseUrl = 'https://api.case.law/v1/cases/';
  caseUrl += req.params.caseId;
  caseUrl += '/?body_format=xml';
  caseUrl += '&full_case=true';

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

          var doc = dxg.buildCaseDocx(capdata);

          if ( doc ) {
            var filename = capdata.name_abbreviation + '.docx';

            const packer = new docx.Packer();

            packer.toBase64String(doc).then((string) => {
              res.setHeader( 'Content-Disposition', 'attachment; filename=' + filename );
              res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' );
              var b = new Buffer(string, 'base64');
              res.end( b );
            });
          }
      }
  });
});

module.exports = router;