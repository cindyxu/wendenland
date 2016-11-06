var PASSWORD_SALT_ROUNDS = 2;

var BPromise = require('bluebird');
// var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));

var Errors = require('../errors');

var userSql = require('../sql/user');

module.exports = function(bcrypt) {

    var userHelper = {};

    /* static methods */

    userHelper.createUser = function(db, username, password) {
        if (!username) return BPromise.reject(Errors.USERNAME_NOT_GIVEN);
        if (!password) return BPromise.reject(Errors.PASSWORD_NOT_GIVEN);

        var hash;
        return bcrypt.genSaltAsync(PASSWORD_SALT_ROUNDS)
            .then(function(salt) {
                return bcrypt.hashAsync(password, salt, undefined);
            })
            .then(function(resHash) {
                hash = resHash;
                return userSql.insertUser(db, username, hash);
            });
    };

    userHelper.matchCredentials = function(db, username, password) {
        return userSql.findUserByUsername(db, username)
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