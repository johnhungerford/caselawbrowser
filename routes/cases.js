var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	// console.log(req.query.min + " - " + req.query.max);

	if ( !req.query.url ) { 
		console.log("No url!");
		next(); 
	}

	console.log('CAP API search url: ' + req.query.url);

	request.get({
			url: req.query.url,
			json: true
		}, (caperr, capres, capdata) => {
			if (caperr) {
					console.log('Error:', caperr);
			} else if (capres.statusCode !== 200) {
					console.log('Status:', capres);
			} else {
					// data is already parsed as JSON:
					res.send(capdata);
			}
	});
});

module.exports = router;