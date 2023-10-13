var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var request = require('request');

/* GET portfolio page. */
// router.get('/', function (req, res, next) {
// 	res.render('portfolio');
// });

var download = function (url, filename, callback) {
	request.head(url, function (err, res, body) {
		request(url)
			.pipe(
				fs.createWriteStream(path.resolve(__dirname, '../data/img/' + filename))
			)
			.on('close', callback);
	});
};

router.get('/', function (req, res, next) {
	let data = fs.readFileSync(path.resolve(__dirname, '../data/portfolio.json'));
	res.render('portfolio', { cakes: JSON.parse(data) });
});

router.post('/', jsonParser, function (req, res, next) {
	const expectedAttributed = [
		'url',
		'name',
		'alt',
		'category',
		'header',
		'description',
	];

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

	// Checking for missing url or name
	if (!req.body.url || !req.body.name) {
		return res.status(400).end('Url/name not provided');
	}

	// Checking for invalid category
	if (
		req.body.category &&
		!['wedding', 'christmas', 'birthday', 'anniversary'].includes(
			req.body.category
		)
	) {
		return res.status(400).end('Wrong category provided');
	}

	let rawdata = fs.readFileSync(
		path.resolve(__dirname, '../data/portfolio.json')
	);
	let portfoliosArray = JSON.parse(rawdata);
	if (portfoliosArray.filter((x) => x.name === req.body.name).length == 0) {
		download(req.body.url, req.body.name, function () {
			console.log('done');
		});
		const newArray = portfoliosArray.concat([req.body]);
		fs.writeFileSync(
			path.resolve(__dirname, '../data/portfolio.json'),
			JSON.stringify(newArray)
		);
	}
	res.end();
});

router.delete('/', jsonParser, function (req, res, next) {
	let rawdata = fs.readFileSync(
		path.resolve(__dirname, '../data/portfolio.json')
	);
	let portfoliosArray = JSON.parse(rawdata);
	const newArray = portfoliosArray.filter((x) => x.name !== req.body.name);
	if (newArray.length !== portfoliosArray.length) {
		fs.unlink(path.resolve(__dirname, '../data/img/' + req.body.name), () => {
			console.log(req.body.name + ' deleted!');
		});
		fs.writeFileSync(
			path.resolve(__dirname, '../data/portfolio.json'),
			JSON.stringify(newArray)
		);
	}
	res.end();
});

module.exports = router;
