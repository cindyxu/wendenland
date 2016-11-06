var Errors = require('../errors');

module.exports = function(partySql, inhabitantSql) {

    var inhabitantHelper = {};

    inhabitantHelper.createInhabitantSeq = function(
        tr, name, species) {
        return partySql.insertParty(tr)
            .then(function(party) {
                return inhabitantSql.insertInhabitantOfSpecies(
                    tr, name, party.id, species);
            })
    };

    return inhabitantHelper;

};