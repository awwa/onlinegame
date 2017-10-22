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
  .use(function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', req.headers.origin);
  	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  	res.header('Access-Control-Allow-Credentials', true);
  	res.header('Access-Control-Max-Age', '86400');
    next();
  })
  .use(express.static('public'))
  //パラメータ
  .param('room_key', function(req, res, next, room_key) {
    req.room_key = room_key;
    next();
  })
  // サーバへのアクセス確認用エンドポイント
  .get('/', function (req, res) {
  	res.send({server_hello: 'Welcome to the onlinegame server!!'});
  })
  // // ルーム解説＆入室
  // .post('/games/:room_key/open', function(req, res) {
  // 	if ('room_key' in req) {
  // 		game.openRoom(req.room_key).then(function onFulfilled(result) {
  //       // ルームへの入室処理結果に応じてsocketのルーム生成やjoinを制御する
  //       console.log(result);
  //       // switch (result) {
  //       //   case 'create':  // ループをオープン
  //       //     console.log('Client join the room ' + req.room_key);
  //       //     // io.sockets.join(req.room_key);
  //       //     break;
  //       //   case 'enter':   // オープン済みのルームに入室
  //       //     console.log('Client enter the room ' + req.room_key);
  //       //     // io.sockets.join(req.room_key);
  //       //     io.to(req.room_key).emit('enter');
  //       //     break;
  //       // }
  //   		res.send({"result": result});
  // 		}).catch(function onRejected(error) {
  // 			console.log(error);
  // 			res.status(500).send({error: error});
  // 		});
  // 	} else {
  // 		res.status(400).send({error: error});
  // 	}
  // })
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
  socket.on('try_create_room', function(data) {
    game.openRoom(data.room_key).then(function onFulfilled(result) {
      // ルームへの入室処理結果に応じてsocketのルーム生成やjoinを制御する
      console.log('try_create_room: ' + result);
      switch (result) {
        case 'create':  // ループを作成
          console.log('join: ' + data.room_key);
          socket.join(data.room_key);
          // socket.to(data.room_key).emit('room_created');
          break;
        case 'enter':   // オープン済みのルームに入室
          console.log('join: ' + data.room_key);
          socket.join(data.room_key);
          // io.sockets.join(req.room_key);
          // io.to(req.room_key).emit('enter');
          break;
      }
      // res.send({"result": result});
    }).catch(function onRejected(error) {
      console.log(error);
      // res.status(500).send({error: error});
    });
  });
  socket.on('send_message', function(data) {
    console.log('send_message: room_key: ' + data.room_key + ', message: ' + data.message);
    // socket.emit('broadcast_message', data);
    io.to(data.room_key).emit('broadcast_message', data);
  });

  socket.on('disconnect', function() {console.log('Client disconnected');});
});

// setInterval(function() {io.emit('time', new Date().toTimeString()), 1000});
