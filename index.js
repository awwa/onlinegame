var PORT = process.env.PORT || 3000;
var express = require('express');
var socketIO = require('socket.io');
var game = require('./models/game.js');
var server = express()
  .use(function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', req.headers.origin);
  	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  	res.header('Access-Control-Allow-Credentials', true);
  	res.header('Access-Control-Max-Age', '86400');
    next();
  })
  .use(express.static('public'))
  .listen(PORT, function () {
	  console.log('Listening on port ' + PORT);
  });

var io = socketIO(server);
// 接続開始
io.on('connection', function(socket) {
  // ルーム作成依頼
  socket.on('try_create_room', function(data) {
    // ルームへの入室処理結果に応じてsocketのルーム生成やjoinを制御する
    game.openRoom(data.room_key).then(function onFulfilled(result) {
      switch (result) {
        case 'create':  // ルームを作成
          socket.join(data.room_key);
          io.to(data.room_key).emit('broadcast_create_room');
          break;
        case 'enter':   // オープン済みのルームに入室
          socket.join(data.room_key);
          io.to(data.room_key).emit('pairing_complete');
          break;
      }
    }).catch(function onRejected(error) {
      // ルームへの入室拒否
      io.to(socket.id).emit('enter_rejected');
    });
  });
  // メッセージ送信イベント処理ハンドラ
  socket.on('send_message', function(data) {
    io.to(data.room_key).emit('broadcast_message', data);
  });
  // プレイヤーを動かすイベントハンドラ
  socket.on('move_player_to', function(data) {
    io.to(data.room_key).emit('broadcast_move_player_to', data);
  });
  // 指定したボールを生成
  socket.on('spawn_ball', function(data) {
    socket.broadcast.to(data.room_key).emit('broadcast_spawn_ball', data);
  });
  // 部屋から退出する
  socket.on('exit_room', function(data) {
    socket.leave(data.room_key);
    game.closeRoom(data.room_key);
  });
  // 接続切断
  socket.on('disconnect', function() {});
});
