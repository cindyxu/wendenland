var Errors = require('../errors');

module.exports = function(partySql, inhabitantSql, db) {

    var inhabitantHelper = {};

    inhabitantHelper.createInhabitantOfSpecies = function(name, species) {
        var species;
        var partyId;

        // create new party for inhabitant
        return partySql.insertParty()
            .then(function(resPartyId) {
                partyId = resPartyId;
                return inhabitantSql.insertInhabitant(
                    name, species.id, partyId,
                    species.stat_str, species.stat_dex,
                    species.stat_int, species.stat_luk, db);
            });
    };

    return inhabitantHelper;

};