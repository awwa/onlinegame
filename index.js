var express = require('express');
var socketIO = require('socket.io');
var path = require('path');
var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, 'public/index.html');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var game = require('./models/game.js');
var server = express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(morgan('dev', {immediate: true}))
  .use(express.static('public'))
  .use(function(req, res, next) {
  	console.log('origin: ' + req.headers.origin);
  	res.header('Access-Control-Allow-Origin', req.headers.origin);
  	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  	res.header('Access-Control-Allow-Credentials', true);
  	res.header('Access-Control-Max-Age', '86400');
    next();
  })
  //パラメータ
  .param('room_key', function(req, res, next, room_key) {
    req.room_key = room_key;
    next();
  })
  .get('/', function (req, res) {
  	res.send(
      {
        server_hello: 'Welcome to the onlinegame server!!'
      }
    );
  })
  // ルーム解説＆入室
  .post('/games/:room_key/open', function(req, res) {
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
  })
// // ゲームの待受開始
// app.post('/games', function(req, res) {
// 	if ('room_key' in req.body) {
// 		game.register(req.body.room_key).then(function onFulfilled(id) {
// 			console.log(id);
// 			res.send({id: id});
// 		}).catch(function onRejected(error) {
// 			console.log(error);
// 			res.status(500).send({error: error});
// 		});
// 	} else {
// 		res.status(400).send({error: error});
// 	}
//
// });
//
// // ゲームの状態変更
// app.patch('/games', function(req, res) {
// 	if ('room_key' in req.query && 'status' in req.body) {
// 		game.updateStatus(req.query.room_key, req.body.status).then(function onFulfilled(result) {
// 			console.log({result: result});
// 			res.send({result: result});
// 		}).catch(function onRejected(error) {
// 			console.log(error);
// 			res.status(500).send({error: error});
// 		});
// 	} else {
// 		res.status(400).send({error: error});
// 	}
// });
//
// // ルームキーでゲームを検索
// app.get('/games', function(req, res) {
// 	if ('room_key' in req.query) {
// 		game.selectOpenRoom(req.query.room_key).then(function onFulfilled(records) {
// 			console.log(JSON.stringify(records));
// 			res.send({games: records});
// 		}).catch(function onRejected(error){
// 			console.log(error);
// 			res.status(500).send({error: error});
// 		});
// 	} else {
// 		res.status(400).send({error: error});
// 	}
// });

  .listen(PORT, function () {
  	  console.log('Example app listening on port ' + PORT);
  });

var io = socketIO(server);
io.on('connection', function(socket) {
  console.log('Client connected');
  socket.on('disconnect', function() {console.log('Client disconnected');});
});

setInterval(function() {io.emit('time', new Date().toTimeString()), 1000});
