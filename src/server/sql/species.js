var sinon = require('sinon');
var BPromise = require('bluebird');

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var speciesSchema = schemas.species;

var speciesSql = {};

speciesSql.findByName = function(name, db) {
    // var query = speciesSchema.select()
    //     .where(speciesSchema.name.equals(name)).toQuery();
    // return db.getAsync(query.text, query.values);
    throw "Not implemented!";
};

module.exports = speciesSql;