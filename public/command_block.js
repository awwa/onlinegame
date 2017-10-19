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

    // 指定したサーバ上にルームをオープンする
    ext.open_room = function(base_url, room_key) {
      var data = JSON.stringify({
        "room_key": room_key
      });

      var xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;
      //
      // xhr.addEventListener("readystatechange", function () {
      //   if (this.readyState === 4) {
      //     console.log(this.responseText);
      //   }
      // });

      xhr.open("POST", "https://onlinegame-awwa.herokuapp.com/games");
      xhr.setRequestHeader("content-type", "application/json");
      // xhr.setRequestHeader('content-type', 'text/plain');
      xhr.setRequestHeader("cache-control", "no-cache");

      xhr.send(data);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'my first block', 'my_first_block'],
            [' ', 'my first block2', 'hoge_block'],
            [' ', 'サーバー : %s にルームキー : %s で部屋をオープンする', 'open_room'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('My first extension', descriptor, ext);
})({});
