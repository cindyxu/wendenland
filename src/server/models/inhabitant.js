var Errors = require('../errors');

var inhabitantModel = function(speciesSql, inhabitantSql, db) {

    var _inhabitantModel = function(id, name, speciesId,
                                    statStr, statDex, statInt, statLuk) {
        this.id = id;
        this.name = name;
        this.speciesId = speciesId;
        this.statStr = statStr;
        this.statDex = statDex;
        this.statInt = statInt;
        this.statLuk = statLuk;
    };

    /* static methods */

    _inhabitantModel.createOfSpecies = function(name, speciesName) {
        var species;
        return speciesSql.findByName(speciesName)
            .then(function(resSpecies) {
                species = resSpecies;
                if (species) {
                    return inhabitantSql.insertRow(name, species.id,
                        species.stat_str, species.stat_dex,
                        species.stat_int, species.stat_luk, db);
                }
                throw Errors.SPECIES_DOES_NOT_EXIST;
            })
            .then(function(resInhabitant) {
                return new _inhabitantModel(resInhabitant.id, name, species.id,
                    species.stat_str, species.stat_dex,
                    species.stat_int, species.stat_luk);
            });
    };

    return _inhabitantModel;

};

module.exports = inhabitantModel;