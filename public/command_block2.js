(function(ext) {
  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};

  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function() {

    return {status: 2, msg: 'Ready'};
  };

  ext.my_first_block = function() {
      // Code that gets executed when the block is run
  };

  ext.hoge_block = function() {

  };

  // // 指定したサーバ上にルームをオープンする
  // ext.open_room = function(base_url, room_key) {
  //   var data = JSON.stringify({
  //     "room_key": room_key
  //   });
  //
  //   var xhr = new XMLHttpRequest();
  //   // xhr.withCredentials = true;
  //   //
  //   // xhr.addEventListener("readystatechange", function () {
  //   //   if (this.readyState === 4) {
  //   //     console.log(this.responseText);
  //   //   }
  //   // });
  //
  //   xhr.open("POST", "http://onlinegame-awwa.herokuapp.com/games");
  //   xhr.setRequestHeader("content-type", "application/json");
  //   // xhr.setRequestHeader('content-type', 'text/plain');
  //   xhr.setRequestHeader("cache-control", "no-cache");
  //
  //   xhr.send(data);
  // };

  ext.open_room = function(server_url, room_key, callback) {
    $.ajax({
      url: server_url + '/games/' + room_key + '/open',
      type: 'POST',
      dataType: 'json',
      timeout: 5000,
      success: function(response){
        console.log(response);
        switch (response.result) {
          case 'create':
            var socket = io.connect(serverpath);
            // socket.join(room_key);
            break;
          case 'enter':
            var socket2 = io.connect(serverpath);
            // io.on('connection', function(socket2){
            //   socket2.join(room_key);
            //   io.to(room_key).emit('enter');
            // });
            break;
        }

        // socket.on('time', function(timeString) {
        //   console.log(timeString);
        // });
        // TODO 発動していないようにみえる。もう一回テスト
        // socket.on('enter', function(hoge) {
        //   console.log('someone entered this room');
        // });

        callback(response.result);
      },
      error : function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest); // XMLHttpRequestオブジェクト
        console.log(textStatus); // status は、リクエスト結果を表す文字列
        console.log(errorThrown); // errorThrown は、例外オブジェクト
        callback(textStatus);
      },
    });
  };
  // hogehoge
  ext.get_temp = function(location, callback) {
      // Make an AJAX call to the Open Weather Maps API
      $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=imperial',
            dataType: 'jsonp',
            success: function( weather_data ) {
                // Got the data - parse it and return the temperature
                temperature = weather_data['main']['temp'];
                callback(temperature);
            }
      });
  };

  // サーバーHelloの取得（サーバーの存在確認）
  ext.server_hello = function(server_url, callback) {
    $.ajax({
      url: server_url,
      success: function(response) {
        console.log(response);
        callback(response.server_hello);
      },
      error : function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest); // XMLHttpRequestオブジェクト
        console.log(textStatus); // status は、リクエスト結果を表す文字列
        console.log(errorThrown); // errorThrown は、例外オブジェクト
        callback(textStatus);
      },
    });
  };

  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      // Block type, block name, function name
      [' ', 'my first block', 'my_first_block'],
      [' ', 'my first block3', 'hoge_block'],
      // [' ', 'サーバー %s にルームキー : %s で部屋をオープンする', 'open_room'],
      ['R', '%s にて %s で部屋をオープンする', 'open_room', '', ''],
      ['R', 'current temperature in city %s', 'get_temp', 'Boston, MA'],
      ['R', 'サーバー %s からHello取得', 'server_hello', ''],
    ]
  };

  // function hoge() {}

  // Register the extension
  var scriptpath = document.currentScript.src.match(/.*\//);
  var serverpath = scriptpath + '';
  $.getScript(scriptpath + 'socket.io/socket.io.js')
    .done(function() {
      // var socket = io.connect(serverpath);
      // socket.on('time', function(timeString) {
      //   console.log(timeString);
      // });
      // // TODO 発動していないようにみえる。もう一回テスト
      // socket.on('enter', function(hoge) {
      //   console.log('someone entered this room');
      // });
      console.log(scriptpath + 'socket.io/socket.io.js');
      ScratchExtensions.register('My first extension', descriptor, ext);
    });
})({});
