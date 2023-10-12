var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', function (req, res, next) {
	let introductionData = fs.readFileSync(
		path.resolve(__dirname, '../data/introductionArray.json')
	);
	let recommendationsData = fs.readFileSync(
		path.resolve(__dirname, '../data/recommendations.json')
	);

	res.render('index', {
		title: 'Express',
		array: JSON.parse(introductionData),
		data: JSON.parse(recommendationsData),
	});
});

module.exports = router;
