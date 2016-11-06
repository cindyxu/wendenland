var BPromise = require('bluebird');
var Errors = require('../errors');
var speciesSql = require('../sql/species');
var characterSql = require('../sql/character');
var inhabitantHelper = require('./inhabitant');

var characterHelper = {};

characterHelper.createCharacterSeq = function(tr, name, species, userId) {
    if (!name) return BPromise.reject(Errors.CHARACTER_NAME_NOT_GIVEN);
    return inhabitantHelper.createInhabitantSeq(
        tr, name, species)
        // insert a character with the new inhabitant under given user
        .then(function(resInhabitant) {
            return characterSql.insertCharacter(
                tr, userId, resInhabitant.id); 
        });
};

module.exports = characterHelper;