var PASSWORD_SALT_ROUNDS = 2;

var BPromise = require('bluebird');
// var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));

var Errors = require('../errors');

module.exports = function(userSql, bcrypt) {

    var userHelper = {};

    /* static methods */

    userHelper.createUser = function(username, password, db) {
        if (!username) return BPromise.reject(Errors.USERNAME_NOT_GIVEN);
        if (!password) return BPromise.reject(Errors.PASSWORD_NOT_GIVEN);

        var hash;
        return bcrypt.genSaltAsync(PASSWORD_SALT_ROUNDS)
            .then(function(salt) {
                return bcrypt.hashAsync(password, salt, undefined);
            })
            .then(function(resHash) {
                hash = resHash;
                return userSql.insertUser(username, hash, db);
            });
    };

    userHelper.matchCredentials = function(username, password, db) {
        return userSql.findUserByUsername(username, db)
            .then(function(user) {
                if (user) {
                    return bcrypt.compareAsync(password, user.password_hash)
                        .catch(function(e) {
                            throw Errors.WRONG_PASSWORD;
                        });
                } else throw Errors.USER_DOES_NOT_EXIST;
            });
    };

    return userHelper;

};