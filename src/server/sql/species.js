var sinon = require('sinon');
var BPromise = require('bluebird');

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var speciesSchema = schemas.species;

var speciesSql = {
    _findByNameStatement : undefined
};

speciesSql.setup = function(db) {
    // var promise = BPromise.resolve()
    //     // find by name
    //     .then(DbUtil.prepare(speciesSchema.select()
    //         .where(speciesSchema.name.equals("")), db))
    //     .then(function(st) {
    //         speciesSql._findByNameStatement = st;
    //     });

    // return promise;
    throw "Not implemented!";
};

speciesSql.findByName = function(name) {
    // return speciesSql._findByNameStatement.getAsync([name]);
    throw "Not implemented!";
};

module.exports = speciesSql;