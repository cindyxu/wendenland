var PASSWORD_SALT_ROUNDS = 2;

var BPromise = require('bluebird');
// var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));

var Errors = require('../errors');

var characterModel = function(characterSql, db) {

    var _characterModel = function(id, name, userId, inhabitantId) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.inhabitantId = inhabitantId;
    };

    /* static methods */

    _characterModel.create = function(name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return characterSql.create(name, userId)
            .then(function(res) { return new _characterModel(res.id, name, userId, res.inhabitantId); });
    };

    return _characterModel;

};

module.exports = characterModel;