var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev', {immediate: true}));
app.use(express.static(__dirname + '/public'));
var game = require('./models/game.js');


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

app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
});
