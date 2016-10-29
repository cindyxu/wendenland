var sinon = require('sinon');
var BPromise = require('bluebird');

var errors = require("../errors");

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var inhabitantSchema = schemas.inhabitants;

var inhabitantSql = function(speciesSql, db) {

    var _inhabitantSql = {
        _insertStatement : undefined
    };

    _inhabitantSql.setup = function() {
        // var promise = BPromise.resolve()
        //     // insert
        //     .then(DbUtil.prepare(inhabitantSchema.insert(
        //         inhabitantSchema.name.value(""),
        //         inhabitantSchema.species_id.value(""),
        //         inhabitantSchema.stat_str.value(""),
        //         inhabitantSchema.stat_dex.value(""),
        //         inhabitantSchema.stat_int.value(""),
        //         inhabitantSchema.stat_luk.value("")), db))
        //     .then(function(st) {
        //         _inhabitantSql._insertStatement = st;
        //     });

        // return promise;
        throw "Not implemented!";
    };

    _inhabitantSql.insertOfSpecies = function(name, speciesName) {
        // return speciesSql.findByName(speciesName)
        //     .then(function(species) {
        //         if (species) {
        //             return _inhabitantSql.insertRow(name, species.id,
        //                 species.str, species.dex, species.int, species.luk);
        //         }
        //         throw Errors.SPECIES_DOES_NOT_EXIST;
        //     });
        throw "Not implemented!";
    };

    _inhabitantSql.insertRow = function(name, speciesId, str, dex, int, luk) {
        // return _inhabitantSql._insertStatement.runAsync([name, speciesId])
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    return _inhabitantSql;
}
module.exports = inhabitantSql;