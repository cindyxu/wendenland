var BPromise = require('bluebird');
var Errors = require('../errors');

module.exports = function(speciesSql, characterSql, inhabitantHelper) {

    var characterHelper = {};

    characterHelper.createCharacterSeq = function(tr, name, userId) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return speciesSql.findSpeciesByName(tr, "traveller")
            .then(function(resSpecies) {
                return inhabitantHelper.createInhabitantSeq(
                    tr, name, resSpecies);
            })
            // insert a character with the new inhabitant under given user
            .then(function(resInhabitant) {
                return characterSql.insertCharacter(
                    tr, userId, resInhabitant.id); 
            });
    };

    return characterHelper;

};