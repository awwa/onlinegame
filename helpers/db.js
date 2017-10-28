var SETTINGS = process.env.DATABASE_URL || process.env.CLEARDB_DATABASE_URL;
var db = require('mysql');
var pool = db.createPool(SETTINGS);

module.exports = {
  // 接続プールの取得
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
            con.release();
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
            con.release();
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
            con.release();
            resolve(res);
          }
        });
      });
    });
  },
  // レコード削除
  delete: function(query, params) {
    return this.getPool().then(function(con) {
      return new Promise(function(resolve, reject) {
        con.query(query, params, function(err, res) {
          if (err) {
            reject(err);
          } else {
            con.release();
            resolve(res);
          }
        });
      });
    });
  }
};
