var sinon = require('sinon');
var BPromise = require('bluebird');

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var speciesSchema = schemas.species;

var speciesSql = function(db) {

    var _speciesSql = {
        _findByNameStatement : undefined
    };

    _speciesSql.setup = function(db) {
        // var promise = BPromise.resolve()
        //     // find by name
        //     .then(DbUtil.prepare(speciesSchema.select()
        //         .where(speciesSchema.name.equals("")), db))
        //     .then(function(st) {
        //         _speciesSql._findByNameStatement = st;
        //     });

        // return promise;
        throw "Not implemented!";
    };

    _speciesSql.findByName = function(name) {
        // return _speciesSql._findByNameStatement.getAsync([name]);
        throw "Not implemented!";
    };

    return _speciesSql;

}

module.exports = speciesSql;