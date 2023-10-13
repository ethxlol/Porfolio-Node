var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET recommendations page. */
router.get('/', function (req, res, next) {
	let data = fs.readFileSync(
		path.resolve(__dirname, '../data/recommendations.json')
	);
	res.render('recommendations', { data: JSON.parse(data) });
});

router.post('/', jsonParser, function (req, res, next) {
	const expectedAttributed = ['avatar', 'name', 'role', 'description'];

	// Checking for unexpected attributes
	Object.keys(req.body).forEach((param) => {
		if (!expectedAttributed.includes(param)) {
			return res.status(400).end('Wrong Attr');
		} else {
			if (req.body[param] == '') {
				return res.status(400).end(param + ' must have a value');
			}
		}
	});

	// Checking for missing avatar or name
	if (!req.body.avatar || !req.body.name) {
		return res.status(400).end('Avatar/name not provided');
	}

	// Checking for invalid avatar
	if (![1, 2, 3].includes(req.body.avatar)) {
		return res.status(400).end('Wrong avatar provided');
	}

	let rawdata = fs.readFileSync(
		path.resolve(__dirname, '../data/recommendations.json')
	);
	let recommendationsArray = JSON.parse(rawdata);
	if (
		recommendationsArray.filter((x) => x.name === req.body.name).length == 0
	) {
		const newArray = recommendationsArray.concat([req.body]);
		fs.writeFileSync(
			path.resolve(__dirname, '../data/recommendations.json'),
			JSON.stringify(newArray)
		);
	}
	res.end();
});

router.delete('/', jsonParser, function (req, res, next) {
	let rawdata = fs.readFileSync(
		path.resolve(__dirname, '../data/recommendations.json')
	);
	let recommendationsArray = JSON.parse(rawdata);
	const newArray = recommendationsArray.filter((x) => x.name !== req.body.name);
	if (newArray.length !== recommendationsArray.length) {
		fs.writeFileSync(
			path.resolve(__dirname, '../data/recommendations.json'),
			JSON.stringify(newArray)
		);
	}
	res.end();
});

module.exports = router;
