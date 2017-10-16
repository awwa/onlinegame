var db = require('mysql');
var settings = {
  'connectionLimit': 10,
  'host': 'localhost',
  'user': 'onlinegame',
  'password': process.env.MYSQL_PASSWORD,
  'database': 'onlinegame'
};
var pool = db.createPool(settings);

module.exports = {
  getPool: function() {
    return new Promise(function(resolve, reject) {
      pool.getConnection(function(err, con) {
        if (err) {
          reject(err);
        } else {
          resolve(con);
        }
      });
    });
  },
  // データ取得
  select: function(query, params) {
    return this.getPool().then(function(con) {
      return new Promise(function(resolve, reject) {
        con.query(query, params, function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    });
  },
  // 1レコード挿入
  insert: function(query, params) {
    return this.getPool().then(function(con) {
      return new Promise(function(resolve, reject) {
        con.query(query, params, function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res.insertId);
          }
        });
      });
    });
  },
  // レコード更新
  update: function(query, params) {
    return this.getPool().then(function(con) {
      return new Promise(function(resolve, reject) {
        con.query(query, params, function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    });
  }
};

// TEST
// module.exports.select('SELECT * FROM games WHERE `room_key` = ?', ['hogekey']).then(function onFulfilled(value) {
//   console.log(JSON.stringify(value));
// });

// module.exports.insert('INSERT INTO games SET ?', {room_key: 'testkey02'}).then(function onFulfilled(value) {
//   console.log(JSON.stringify(value));
// });
