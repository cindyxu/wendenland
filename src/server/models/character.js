var BPromise = require('bluebird');

var Errors = require('../errors');

var characterModel = function(inhabitantModel, characterSql, db) {

    var _characterModel = {};

    _characterModel.create = function(name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return _characterModel._createTransaction(name, userId, db);
    };

    _characterModel._createTransaction = function(name, userId) {
        var transaction;
        var characterId;
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
            .then(function(resInhabitantId) {
                return characterSql.insertRow(
                    userId, resInhabitantId, transaction); })

            .then(function(resCharacterId) {
                characterId = resCharacterId;
                return transaction.commitAsync(); })

            .then(function() {
                return characterId;
            });
    };

    return _characterModel;

};

module.exports = characterModel;