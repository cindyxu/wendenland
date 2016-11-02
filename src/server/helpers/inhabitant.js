var Errors = require('../errors');

module.exports = function(partySql, inhabitantSql, db) {

    var inhabitantHelper = {};

    inhabitantHelper.createOfSpecies = function(name, species) {
        var species;
        var partyId;

        // create new party for inhabitant
        return partySql.insertRow()
            .then(function(resPartyId) {
                partyId = resPartyId;
                return inhabitantSql.insertRow(name, species.id, partyId,
                    species.stat_str, species.stat_dex,
                    species.stat_int, species.stat_luk, db);
            });
    };

    return inhabitantHelper;

};