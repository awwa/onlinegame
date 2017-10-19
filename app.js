var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev', {immediate: true}));

// var crossdomain = require('crossdomain');
// var xml = crossdomain({ domain: '*.segment.io' });
// app.all('/crossdomain.xml', function (req, res, next) {
//   res.set('Content-Type', 'application/xml; charset=utf-8');
//   res.send(xml, 200);
// });

app.use(express.static(__dirname + '/public'));
// CORSを許可する
var ALLOWED_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS'
];
app.use(function(req, res, next) {
	console.log('origin: ' + req.headers.origin);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Max-Age', '86400');

  // res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Methods", ALLOWED_METHODS.join(','));
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var game = require('./models/game.js');

app.options('*', function (req, res) {
  res.sendStatus(200);
});

app.get( "/crossdomain.xml", onCrossDomainHandler )
function onCrossDomainHandler( req, res ) {
  // var xml = '<?xml version="1.0"?>\n<!DOCTYPE cross-domain-policy SYSTEM' +
  //           ' "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">\n<cross-domain-policy>\n';
  //     xml += '<allow-access-from domain="*" to-ports="*"/>\n';
  //     xml += '</cross-domain-policy>\n';
	// var xml = '<cross-domain-policy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.adobe.com/xml/schemas/PolicyFile.xsd">\n' +
	// 		  '<site-control permitted-cross-domain-policies="master-only"/>\n' +
	// 		  '<allow-access-from domain="scratchx.org"/>\n' +
	// 		  '<allow-access-from domain="llk.github.io"/>\n' +
	// 		'</cross-domain-policy>\n';
	var xml = '<cross-domain-policy>' +
		'<allow-access-from domain="*" to-ports="80"/>' +
		'</cross-domain-policy>';

  req.setEncoding('utf8');
  res.writeHead( 200, {'Content-Type': 'text/xml'} );
  res.end( xml );
}

app.get('/', function (req, res) {
	res.send('Hello World!');
});

// ゲームの待受開始
app.post('/games', function(req, res) {
	if ('room_key' in req.body) {
		game.register(req.body.room_key).then(function onFulfilled(id) {
			console.log(id);
			res.send({id: id});
		}).catch(function onRejected(error) {
			console.log(error);
			res.status(500).send({error: error});
		});
	} else {
		res.status(400).send({error: error});
	}
});

// ゲームの状態変更
app.patch('/games', function(req, res) {
	if ('room_key' in req.query && 'status' in req.body) {
		game.updateStatus(req.query.room_key, req.body.status).then(function onFulfilled(result) {
			console.log({result: result});
			res.send({result: result});
		}).catch(function onRejected(error) {
			console.log(error);
			res.status(500).send({error: error});
		});
	} else {
		res.status(400).send({error: error});
	}
});

// ルームキーでゲームを検索
app.get('/games', function(req, res) {
	if ('room_key' in req.query) {
		game.selectOpenRoom(req.query.room_key).then(function onFulfilled(records) {
			console.log(JSON.stringify(records));
			res.send({games: records});
		}).catch(function onRejected(error){
			console.log(error);
			res.status(500).send({error: error});
		});
	} else {
		res.status(400).send({error: error});
	}
});

app.listen(app.get('port'), function () {
	  console.log('Example app listening on port ' + app.get('port'));
});
