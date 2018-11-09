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

          var doc = dxg.buildCaseDocx(capdata);

          if ( doc ) {
            capdata.filename = capdata.id + '.docx';
            var filepath = path.join('public/' + capdata.filename);

            const packer = new docx.Packer();

            packer.toBuffer(doc).then((buffer) => {
              fs.writeFileSync(filepath, buffer);
            });
          }

      		res.send(capdata);
    	}
	});
});

module.exports = router;