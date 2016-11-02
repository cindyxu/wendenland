// Opens an sqlite database at given path and reads sql definitions from tables.
// Returns a map of table defines.

var _ = require('lodash');
var sqlite3 = require('sqlite3');
var BPromise = require('bluebird');

var readTables = function(db) {
	var dbDefine = {};

    db.allAsync(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        .then(function(tables) {
            var p = Promise.resolve();
            _.each(tables, function(table) {
                p = p.then(function() { return db.allAsync(
                	// doesn't take parameters so we have to string concat here
                    "PRAGMA TABLE_INFO(" + table.name + ")"); })
                        .then(function(columns) {
                            table.columns = columns;
                            dbDefine[table.name] = sql.define(table);
                        });
            });
            return p;
        })
        .then(function() {
            return dbDefine;
        });
};

module.exports = readTables;