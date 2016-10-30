var PASSWORD_SALT_ROUNDS = 2;

var BPromise = require('bluebird');
// var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));

var Errors = require('../errors');

var userModel = function(userSql, bcrypt, db) {

    var _userModel = function(id, username, passwordHash) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
    };

    /* static methods */

    _userModel.create = function(username, password) {
        if (!username) return BPromise.reject(Errors.USERNAME_NOT_GIVEN);
        if (!password) return BPromise.reject(Errors.PASSWORD_NOT_GIVEN);

        var hash;
        return bcrypt.genSaltAsync(PASSWORD_SALT_ROUNDS)
            .then(function(salt) {
                return bcrypt.hashAsync(password, salt, undefined);
            })
            .then(function(resHash) {
                hash = resHash;
                return userSql.insertRow(username, hash, db);
            })
            .then(function(id) { return new _userModel(id, username, hash) });
    };

    _userModel.findByUsername = function(username) {
        return userSql.findByUsername(username, db)
            .then(function(res) {
                return new _userModel(res.id, res.username, res.passwordHash);
            });
    };

    /* instance methods */

    _userModel.prototype.matchCredentials = function(username, password) {
        return bcrypt.compareAsync(password, this.passwordHash)
            .catch(function(e) {
                throw Errors.WRONG_PASSWORD;
            });
    };

    return _userModel;

};

module.exports = userModel;