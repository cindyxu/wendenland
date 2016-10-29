var PASSWORD_SALT_ROUNDS = 2;

var BPromise = require('bluebird');
// var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));

var Errors = require('../errors');

var userModel = function(userSql, bcrypt) {

    var userModel = function(id, username, passwordHash) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
    };

    /* static methods */

    userModel.create = function(username, password) {
        if (!username) return BPromise.reject(Errors.USERNAME_NOT_GIVEN);
        if (!password) return BPromise.reject(Errors.PASSWORD_NOT_GIVEN);

        var hash;
        return bcrypt.genSaltAsync(PASSWORD_SALT_ROUNDS)
            .then(function(salt) {
                return bcrypt.hashAsync(password, salt, undefined);
            })
            .then(function(resHash) {
                hash = resHash;
                return userSql.create(username, hash);
            })
            .then(function(id) { return new userModel(id, username, hash) });
    };

    userModel.findByUsername = function(username) {
        return userSql.findByUsername(username)
            .then(function(res) {
                return new userModel(res.id, res.username, res.passwordHash);
            });
    };

    /* instance methods */

    userModel.prototype.matchCredentials = function(username, password) {
        return bcrypt.compareAsync(password, this.passwordHash)
            .catch(function(e) {
                throw Errors.WRONG_PASSWORD;
            });
    };

    return userModel;

};

module.exports = userModel;