var Errors = require('../errors');
var inhabitantSql = require('../sql/inhabitant');
var partySql = require('../sql/party');

var inhabitantHelper = {};

inhabitantHelper.createInhabitantSeq = function(
    tr, name, species) {
    return partySql.insertParty(tr)
        .then(function(party) {
            return inhabitantSql.insertInhabitantOfSpecies(
                tr, name, species, party.id);
        })
};

module.exports = inhabitantHelper;
