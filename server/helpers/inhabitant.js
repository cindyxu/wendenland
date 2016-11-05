var Errors = require('../errors');

module.exports = function(partySql, inhabitantSql) {

    var inhabitantHelper = {};

    inhabitantHelper.createInhabitantSeq = function(
        name, species, tr) {
        return partySql.insertParty(tr)
            .then(function(party) {
                return inhabitantSql.insertInhabitantOfSpecies(
                    name, party.id, species, tr);
            })
    };

    return inhabitantHelper;

};