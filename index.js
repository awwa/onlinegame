var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev', {immediate: true}));
app.use(express.static('public'));
app.use(function(req, res, next) {
	console.log('origin: ' + req.headers.origin);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Max-Age', '86400');
  next();
});
var game = require('./models/game.js');
var socket = require('./socket.js');

app.get('/', function (req, res) {
	res.send(
    {
      server_hello: 'Welcome to the onlinegame server!!'
    }
  );
});

//パラメータ
app.param('room_key', function(req, res, next, room_key) {
  req.room_key = room_key;
  next();
});

//
app.post('/games/:room_key/open', function(req, res) {
	if ('room_key' in req) {
		game.openRoom(req.room_key).then(function onFulfilled(id) {
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
