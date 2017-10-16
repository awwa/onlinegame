'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('games', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    room_key: { type: 'string', notNull: true},
    status: {type: 'string', defaultValue: 'open', notNull: true}
  }, function() {
    db.addIndex('games', 'unique_room_key', 'room_key', true);
  });
  return null;
};

exports.down = function(db) {
  db.dropTable('games');
  return null;
};

exports._meta = {
  "version": 2
};
