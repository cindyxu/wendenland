var BPromise = require('bluebird');

var Errors = require('../errors');

var characterController = function(characterSql) {

    var characterController = {};

    characterController.create = function(name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);
        return characterSql.create(name, userId);
    };

    return characterController;

};

module.exports = characterController;