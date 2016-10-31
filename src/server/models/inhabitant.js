var Errors = require('../errors');

var inhabitantModel = function(speciesSql, partySql, inhabitantSql, db) {

    var _inhabitantModel = function(id, name, speciesId, partyId,
                                    statStr, statDex, statInt, statLuk) {
        this.id = id;
        this.name = name;
        this.speciesId = speciesId;
        this.partyId = partyId;
        this.statStr = statStr;
        this.statDex = statDex;
        this.statInt = statInt;
        this.statLuk = statLuk;
    };

    /* static methods */

    _inhabitantModel.createOfSpecies = function(name, speciesName) {
        var species;
        var partyId;

        // create new party for inhabitant
        return partySql.insertRow()
            .then(function(resPartyProps) {
                partyId = resPartyProps.id;
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
            })
            .then(function(resInhabitantProps) {
                return new _inhabitantModel(resInhabitantProps.id, 
                    name, species.id, partyId,
                    species.stat_str, species.stat_dex,
                    species.stat_int, species.stat_luk);
            });
    };

    return _inhabitantModel;

};

module.exports = inhabitantModel;