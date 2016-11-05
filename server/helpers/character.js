var BPromise = require('bluebird');
var Errors = require('../errors');

module.exports = function(speciesSql, characterSql, inhabitantHelper) {

    var characterHelper = {};

    characterHelper.createCharacterSeq = function(name, userId, tr) {
        if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);

        return speciesSql.findSpeciesByName("traveller", tr)
            .then(function(resSpecies) {
                return inhabitantHelper.createInhabitantSeq(
                    name, resSpecies, tr);
            })
            // insert a character with the new inhabitant under given user
            .then(function(resInhabitant) {
                return characterSql.insertCharacter(
                    userId, resInhabitant.id, tr); 
            })
            .then(function(resCharacter) {
                return resCharacter.id;
            });
    };

    return characterHelper;

};