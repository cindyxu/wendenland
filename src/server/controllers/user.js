var PASSWORD_SALT_ROUNDS = 2;

var BPromise = require('bluebird');
// var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));

var Errors = require('../errors');

var userController = function(userSql, bcrypt) {

    var userController = {};

    userController.create = function(username, password) {
        if (!username) return BPromise.reject(Errors.USERNAME_NOT_GIVEN);
        if (!password) return BPromise.reject(Errors.PASSWORD_NOT_GIVEN);

        return bcrypt.genSaltAsync(PASSWORD_SALT_ROUNDS)
            .then(function(salt) {
                return bcrypt.hashAsync(password, salt, undefined);
            })
            .then(function(hash) { return userSql.create(username, hash); });
    };

    userController.matchCredentials = function(username, password) {
        return userSql.findByUsername(username)
            .then(function(user) {
                if (user) return bcrypt.compareAsync(password, user.password_hash)
                    .catch(function(e) {
                        throw Errors.WRONG_PASSWORD;
                    });
                else return BPromise.reject(Errors.USER_DOES_NOT_EXIST);
            });
    };

    return userController;

};

module.exports = userController;