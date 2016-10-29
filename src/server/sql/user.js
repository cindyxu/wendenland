var sinon = require('sinon');
var BPromise = require('bluebird');

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var userSchema = schemas.users;

var userSql = function(db) {

    var _userSql = {
        _insertStatement : undefined,
        _findByUsernameStatement : undefined
    };

    _userSql.setup = function() {
        // var promise = BPromise.resolve()

        //     // insert
        //     .then(DbUtil.prepare(userSchema.insert(
        //         userSchema.username.value(""),
        //         userSchema.password_hash.value("")), db))
        //     .then(function(st) {
        //         _userSql._insertStatement = st;
        //     })

        //     // find by username
        //     .then(DbUtil.prepare(userSchema.select()
        //         .where(userSchema.username.equals("")), db))
        //     .then(function(st) {
        //         _userSql._findByUsernameStatement = st;
        //     });

        // return promise;
        throw "Not implemented!";
    };

    _userSql.create = function(username, passwordHash) {
        // return _userSql.insertRow(username, passwordHash);
        throw "Not implemented!";
    };

    _userSql.findByUsername = function(username) {
        // return _userSql._findByUsernameStatement.getAsync([username]);
        throw "Not implemented!";
    };

    _userSql.insertRow = function(username, passwordHash) {
        // return _userSql._insertStatement.runAsync([username, passwordHash])
        //     .then(function() { return this.lastID });
        throw "Not implemented!";
    };

    return _userSql;
};

module.exports = userSql;