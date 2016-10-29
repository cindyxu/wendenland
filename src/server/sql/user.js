var sinon = require('sinon');
var BPromise = require('bluebird');

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var userSchema = schemas.users;

var userSql = {
    _insertStatement : undefined,
    _findByUsernameStatement : undefined
};

userSql.setup = function(db) {
    // var promise = BPromise.resolve()

    //     // insert
    //     .then(DbUtil.prepare(userSchema.insert(
    //         userSchema.username.value(""),
    //         userSchema.password_hash.value("")), db))
    //     .then(function(st) {
    //         userSql._insertStatement = st;
    //     })

    //     // find by username
    //     .then(DbUtil.prepare(userSchema.select()
    //         .where(userSchema.username.equals("")), db))
    //     .then(function(st) {
    //         userSql._findByUsernameStatement = st;
    //     });
    
    // return promise;
    throw "Not implemented!";
};

userSql.create = function(username, passwordHash) {
    // return userSql.insertRow(username, passwordHash);
    throw "Not implemented!";
};

userSql.findByUsername = function(username) {
    // return userSql._findByUsernameStatement.getAsync([username]);
    throw "Not implemented!";
};

userSql.insertRow = function(username, passwordHash) {
    // return userSql._insertStatement.runAsync([username, passwordHash])
    //     .then(function() { return this.lastID });
    throw "Not implemented!";
};

module.exports = userSql;