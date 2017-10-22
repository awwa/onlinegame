(function(ext) {
  var scriptpath = document.currentScript.src.match(/.*\//);
  var serverpath = scriptpath + '';
  $.getScript(scriptpath + 'socket.io/socket.io.js')
    .done(function() {

      var socket = io.connect(serverpath);
      var message = '';

      // Cleanup function when the extension is unloaded
      ext._shutdown = function() {};

      // Status reporting code
      // Use this to report missing hardware, plugin or unsupported browser
      ext._getStatus = function() {

        return {status: 2, msg: 'Ready'};
      };

      // ルーム内ブロードキャストを受信
      socket.on('broadcast_message', function(data) {
        console.log('broadcast_message');
        console.log(data);
        message = data.message;
      });

      // ルームキーで部屋をオープン
      ext.open_room = function(room_key) {
        console.log('open_room: ' + room_key);
        socket.emit('try_create_room', {room_key: room_key});
      };

      //
      ext.received_message = function() {
        return message;
      };

      // クライアントからメッセージ送信
      ext.send_message = function(room_key, message) {
        console.log('send_message: room_key: ' + room_key + ', message: ' + message);
        socket.emit('send_message', {room_key: room_key, message: message});
      };

      // Block and block menu descriptions
      var descriptor = {
        blocks: [
          // Block type, block name, function name
          [' ', '%s で部屋をオープンする', 'open_room', '', ''],
          ['r', '受信メッセージ', 'received_message'],
          [' ', 'ルーム %s にメッセージを送信 %s', 'send_message', 'hoge_room', 'hoge_message'],
        ]
      };

      console.log(scriptpath + 'socket.io/socket.io.js');
      ScratchExtensions.register('My first extension', descriptor, ext);
    });
})({});
