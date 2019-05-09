var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({type: '*/*'}));
var router = express.Router();

router.route('/search')
	.get((req, res) => {
		var data = req.query.search;
		var found_entry = [];
		var db = JSON.parse(require('fs').readFileSync('./db.json'));
		
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Credentials', true);
		res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
		res.set('Access-Control-Allow-Headers', 'Content-Type');
		
		found_entry = db.find(i => {
			return i.input.indexOf(data) > -1;
		});
		found_entry = typeof found_entry == 'undefined' ? [] : found_entry.output.sort(function () {
			return .5 - Math.random();
		});
		res.json(found_entry);
	})
	.all(function (req, res, next) {
		res.status(405).end();
	});

router.route('/')
	.get((req, res) => {
		res.sendFile(path.join(__dirname + '/index.html'));
	})
	.all(function (req, res, next) {
		res.status(405).end();
	});

app.use('/smart_reply', router);
http.createServer(app).listen(3005);
console.log('Smart Reply Web instance is live on port 3005. To access, go to http://localhost:3005/smart_reply/');
