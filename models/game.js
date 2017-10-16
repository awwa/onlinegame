var db = require('../db.js');

module.exports = {
  // gamesテーブルへinsertする
  register: function(roomKey) {
    return db.insert('INSERT INTO games SET ?', {room_key: roomKey});
  },
  // room_keyが一致するゲームレコードの取得
  selectOpenRoom: function(roomKey) {
    return db.select('SELECT * FROM games WHERE `room_key` = ? AND `status` = "open"', [roomKey]);
  },
  //
  updateStatus: function(roomKey, status) {
    return db.update('UPDATE games SET `status` = ? WHERE `room_key` = ?', [status, roomKey]);
  }
};

// TEST
// module.exports.selectOpenRoom('hogekey').then(function onFulfilled(value) {
//   console.log(JSON.stringify(value));
// }).catch(function onRejected(error) {
//   console.log(JSON.stringify(error));
// });

// module.exports.register('hogekey03').then(function onFulfilled(value) {
//   console.log(JSON.stringify(value));
// }).catch(function onRejected(error) {
//   console.log(JSON.stringify(error));
// });
