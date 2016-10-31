var BPromise = require('bluebird');

var Errors = require('../errors');

var characterModel = function(inhabitantModel, characterSql, db) {

    var _characterModel = function(id, name, user, inhabitant) {
        this.id = id;
        this.name = name;

        this.user = undefined;
        if (user) {
            if (isNaN(user)) {
                this.user = user;
                this.userId = user.id;
            } else {
                this.userId = user;
            }
        }

        this.inhabitant = undefined;
        if (inhabitant) {
            if (isNaN(inhabitant)) {
                this.inhabitant = inhabitant;
                this.inhabitantId = inhabitant.id;
            }
            else {
                this.inhabitantId = inhabitant;
            }
        }
    };

    /* static methods */
    
    _characterModel.create = function(name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return _characterModel._createTransaction(name, userId, db);
    };

    _characterModel._createTransaction = function(name, userId) {
        var transaction;
        var characterId;
        var inhabitant;
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
                inhabitant = resInhabitant;
                return characterSql.insertRow(
                    userId, inhabitant.id, transaction); })

            .then(function(resCharacter) {
                characterId = resCharacter.id;
                return transaction.commitAsync(); })

            .then(function() {
                var character = new _characterModel(
                    characterId, name, userId, inhabitant);
                return character;
            });
    };

    return _characterModel;

};

module.exports = characterModel;