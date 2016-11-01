var Errors = require('../errors');

var inhabitantModel = function(speciesSql, partySql, inhabitantSql, db) {

    var _inhabitantModel = {};

    _inhabitantModel.createOfSpecies = function(name, speciesName) {
        var species;
        var partyId;

        // create new party for inhabitant
        return partySql.insertRow()
            .then(function(resPartyId) {
                partyId = resPartyId;
                return speciesSql.findByName(speciesName);
            })
            // create new inhabitant of species
            .then(function(resSpeciesProps) {
                species = resSpeciesProps;
                if (species) {
                    return inhabitantSql.insertRow(name, species.id, partyId,
                        species.stat_str, species.stat_dex,
                        species.stat_int, species.stat_luk, db);
                }
                throw Errors.SPECIES_DOES_NOT_EXIST;
            });
    };

    return _inhabitantModel;

};

module.exports = inhabitantModel;