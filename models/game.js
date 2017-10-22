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
  },
  // room_keyを指定してルームを開く、もしくはopenなルームに入って鍵を締める
  openRoom: function(roomKey) {
    return db.select('SELECT * FROM games WHERE `room_key` = ?', [roomKey]).then(function onFulfilled(records) {
      if (records.length === 0) {
        return db.insert('INSERT INTO games SET ?', {room_key: roomKey}).then(function Fulfilled(id) {
          console.log('Create a room ' + roomKey);
          return Promise.resolve('create');
        });
      } else if (records.length === 1) {
        if (records[0].status === 'open') {
          // 空いていたら鍵をかけてルームに入る
          console.log('Enter the room ' + roomKey);
          return db.update('UPDATE games SET `status` = ? WHERE `room_key` = ?', ['lock', roomKey]).then(function onFulfilled() {
            return Promise.resolve('enter');
          });
        } else if (records[0].status === 'lock') {
          // 鍵がかかっていたら入室失敗
          return Promise.reject('rejected');
        }
      }
    });
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

// module.exports.openRoom('newkey0').then(function onFullfilled(value) {
//   console.log(JSON.stringify(value));
// }).catch(function onRejected(error) {
//   console.log(JSON.stringify(error));
// });
