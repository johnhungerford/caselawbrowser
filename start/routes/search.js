var express = require('express');
var https = require('https');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var searchQuery = "https://api.case.law/v1/cases/?decision_date_min=" + req.query.min + "&decision_date_max=" + req.query.max;

	https.get(searchQuery, function(data) {
		res.send(data);
	});
});

module.exports = router;