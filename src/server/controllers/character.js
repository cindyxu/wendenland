var BPromise = require('bluebird');

var Errors = require('../errors');

var characterController = function(userSql, characterSql) {

    var characterController = {};

    characterController.create = function(name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return characterSql.create(name, userId)
            .catch(function(e) {
                throw Errors.USER_DOES_NOT_EXIST;
            });
    };

    return characterController;

};

module.exports = characterController;