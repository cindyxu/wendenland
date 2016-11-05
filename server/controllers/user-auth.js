var PASSWORD_SALT_ROUNDS = 2;

var BPromise = require('bluebird');
// var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));

var Errors = require('../errors');

var userController = function(userHelper) {

    var userController = {};

    userController.signup = function(username, password) {
        return userHelper.createUser(username, password);
    };

    userController.login = function(username, password) {
        return userHelper.findByUsername(username)
            .then(function(user) {
                if (user) {
                    return user.matchCredentials(password, user.password_hash);
                }
                else return BPromise.reject(Errors.USER_DOES_NOT_EXIST);
            });
    };

    return userController;

};

module.exports = userController;