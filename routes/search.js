var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	console.log(req.query.min + " - " + req.query.max);

	var searchQuery = "https://api.case.law/v1/cases/?decision_date_min=" + req.query.min + "-01-01&decision_date_max=" 
		+ req.query.max + "-12-31";

	console.log(searchQuery);

	request.get({
    	url: searchQuery,
    	json: true
  	}, (caperr, capres, capdata) => {
    	if (caperr) {
      		console.log('Error:', caperr);
    	} else if (capres.statusCode !== 200) {
      		console.log('Status:', capres);
    	} else {
      		// data is already parsed as JSON:
      		console.log(capdata);
      		res.send(capdata.results);
    	}
	});
});

module.exports = router;