var BPromise = require('bluebird');

var Errors = require('../errors');

module.exports = function(speciesSql, characterSql, inhabitantHelper, db) {

    var characterHelper = {};

    characterHelper.createCharacter = function(name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return characterHelper._createCharacterTransaction(name, userId);
    };

    characterHelper._createCharacterTransaction = function(name, userId) {
        var transaction;
        var characterId;
        // atomic operation
        return db.beginTransactionAsync()

            // insert a new inhabitant of the "traveller" species
            .then(function(resTransaction) {
                transaction = BPromise.promisifyAll(resTransaction);
                return speciesSql.findSpeciesByName("traveller", db);
            })
            .then(function(resSpecies) {
                return inhabitantHelper.createInhabitantOfSpecies(
                    name, resSpecies, transaction);
            })
            // insert a character with the new inhabitant under given user
            .then(function(resInhabitantId) {
                return characterSql.insertCharacter(
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