var BPromise = require('bluebird');

var Errors = require('../errors');

module.exports = function(inhabitantHelper, characterSql, db) {

    var characterHelper = {};

    characterHelper.create = function(name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return characterHelper._createTransaction(name, userId, db);
    };

    characterHelper._createTransaction = function(name, userId) {
        var transaction;
        var characterId;
        // atomic operation
        return db.beginTransactionAsync()

            // insert a new inhabitant of the "traveller" species
            .then(function(resTransaction) {
                transaction = BPromise.promisifyAll(resTransaction);
            })

            .then(function() {
                return inhabitantHelper.createOfSpecies(
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

    return characterHelper;

};