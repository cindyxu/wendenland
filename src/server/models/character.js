var PASSWORD_SALT_ROUNDS = 2;

var BPromise = require('bluebird');
// var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));

var Errors = require('../errors');

var characterModel = function(inhabitantModel, characterSql, db) {

    var _characterModel = function(id, name, userId, inhabitantId) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.inhabitantId = inhabitantId;
    };

    /* static methods */
    
    _characterModel.create = function(name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return _characterModel._createTransaction(name, userId, db)
            .then(function(res) {
                return new _characterModel(
                    res.id, name, userId, res.inhabitantId); });
    };

    _characterModel._createTransaction = function(name, userId) {
        var transaction;
        var characterId;
        var inhabitantId;
        // atomic operation
        return db.beginTransactionAsync()

            // insert a new inhabitant of the "traveller" species
            .then(function(resTransaction) {
                transaction = BPromise.promisifyAll(resTransaction);
            })

            .then(function() {
                return inhabitantModel.createOfSpecies(
                    name, "traveller" /* speciesName */, transaction);
            })
            // insert a character with the new inhabitant under given user
            .then(function(resInhabitant) {
                inhabitantId = resInhabitant.id;
                return characterSql.insertRow(
                    userId, inhabitantId, transaction); })

            .then(function(resCharacter) {
                characterId = resCharacter.id;
                return transaction.commitAsync(); })

            .then(function() {
                return new _characterModel(
                    characterId, name, userId, inhabitantId);
            });
    };

    return _characterModel;

};

module.exports = characterModel;