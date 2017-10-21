var http = require('http');
//サーバインスタンス作成
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type':'text/html'});
  res.end('server connected');
});
var io = require('socket.io').listen(server);
// server.listen(process.env.PORT || 3000);
server.listen(8888);
//接続確立時の処理
io.sockets.on('connection', function (socket) {
  // この中でデータのやり取りを行う
  console.log('connected');
});
