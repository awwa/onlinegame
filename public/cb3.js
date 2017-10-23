(function(ext) {
  var scriptpath = document.currentScript.src.match(/.*\//);
  var serverpath = scriptpath + '';
  $.getScript(scriptpath + 'socket.io/socket.io.js')
    .done(function() {

      var socket = io.connect(serverpath);
      var message = '';
      var room_created = false;
      var pair = false;
      var red_player_x = 0;
      var yellow_player_x = 0;
      var red_ball_x = 0;
      var red_ball_y = 0;
      var spawn_red_ball = false;
      var yellow_ball_x = 0;
      var yellow_ball_y = 0;
      var spawn_yellow_ball = false;

      // Cleanup function when the extension is unloaded
      ext._shutdown = function() {};

      // Status reporting code
      // Use this to report missing hardware, plugin or unsupported browser
      ext._getStatus = function() {

        return {status: 2, msg: 'Ready'};
      };

      // ルーム内ブロードキャストを受信
      socket.on('broadcast_message', function(data) {
        // console.log('broadcast_message');
        // console.log(data);
        message = data.message;
      });

      // 部屋の作成完了イベントハンドラ
      socket.on('broadcast_create_room', function() {
        // console.log('broadcast_create_room');
        room_created = true;
      });

      socket.on('pairing_complete', function() {
        // console.log('pairing_complete');
        pair = true;
      });

      socket.on('broadcast_move_player_to', function(data) {
        // console.log('broadcast_move_player_to: color: ' + data.color + ', move_x_to: ' + data.move_x_to);
        if (data.color === 'red') {
          red_player_x = data.move_x_to;
        }
        if (data.color === 'yellow') {
          yellow_player_x = data.move_x_to;
        }
      });

      socket.on('broadcast_spawn_ball', function(data) {
        console.log('broadcast_spawn_ball: color: ' + data.color + ', x: ' + data.x + ', y: ' + data.y);
        if (data.color === 'red') {
          red_ball_x = data.x;
          red_ball_y = data.y;
          spawn_red_ball = true;
        }
        if (data.color === 'yellow') {
          yellow_ball_x = data.x;
          yellow_ball_y = data.y;
          spwn_yellow_ball = true;
        }
      });

      // ルームキーで部屋をオープン
      ext.open_room = function(room_key) {
        // console.log('open_room: ' + room_key);
        socket.emit('try_create_room', {room_key: room_key});
      };

      //
      ext.received_message = function() {
        return message;
      };

      // redプレイヤーのx座標
      ext.red_player_x = function() {
        return red_player_x;
      };

      ext.yellow_player_x = function() {
        return yellow_player_x;
      };

      // クライアントからメッセージ送信
      ext.send_message = function(room_key, message) {
        // console.log('send_message: room_key: ' + room_key + ', message: ' + message);
        socket.emit('send_message', {room_key: room_key, message: message});
      };

      // プレイヤーを動かす
      ext.move_player_to = function(room_key, color, move_x_to) {
        // console.log('move_player_to: room_key: ' + room_key + ', color: ' + color + ', move_x_to: ' + move_x_to);
        socket.emit(
          'move_player_to', {room_key: room_key, color: color, move_x_to: move_x_to}
        );
      };

      // 指定したボールを生成
      ext.spawn_ball = function(room_key, color, x, y) {
        socket.emit(
          'spawn_ball', {room_key: room_key, color :color, x: x, y: y}
        );
      };

      // ルーム作成完了
      ext.room_created = function() {
        if (room_created === true) {
          room_created = false;
          return true;
        }
        return false;
      };

      // ペアリング完了
      ext.paring_complete = function() {
        if (pair === true) {
          pair = false;
          return true;
        }
        return false;
      };

      // red_ball生成
      ext.spawn_red_ball = function() {
        if (spawn_red_ball === true) {
          spawn_red_ball = false;
          return true;
        }
        return false;
      };

      // yellow_ball生成
      ext.spawn_yellow_ball = function() {
        if (spawn_yellow_ball === true) {
          spawn_yellow_ball = false;
          return true;
        }
        return false;
      };

      // Block and block menu descriptions
      var descriptor = {
        blocks: [
          // Block type, block name, function name
          [' ', '%s で部屋をオープンする', 'open_room', '', ''],
          ['r', '受信メッセージ', 'received_message'],
          ['r', 'redプレイヤーx座標', 'red_player_x'],
          ['r', 'yellowプレイヤーx座標', 'yellow_player_x'],
          ['r', 'red_ball x座標', 'red_ball_x'],
          ['r', 'red_ball y座標', 'red_ball_y'],
          ['r', 'yellow_ball x座標', 'yellow_ball_x'],
          ['r', 'yellow_ball y座標', 'yellow_ball_y'],
          [' ', 'ルーム %s にメッセージを送信 %s', 'send_message', 'room_key', 'hoge_message'],
          [' ', 'ルーム %s のプレイヤー %s のx座標を %n にする', 'move_player_to', 'room_key', 'color', 0],
          [' ', 'ルーム %s にボール %s を座標( %n , %n )から発射', 'spawn_ball', 'room_key', 'ball_color', 0, 0],
          ['h', 'ルーム作成完了', 'room_created'],
          ['h', 'ペアリング完了', 'paring_complete'],
          ['h', 'red_ball生成', 'spawn_red_ball'],
          ['h', 'yellow_ball生成', 'spawn_yellow_ball'],
        ]
      };

      console.log(scriptpath + 'socket.io/socket.io.js');
      ScratchExtensions.register('My first extension', descriptor, ext);
    });
})({});
