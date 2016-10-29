var sinon = require('sinon');
var BPromise = require('bluebird');

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var inhabitantSchema = schemas.inhabitants;

var inhabitantSql = {
    _insertStatement : undefined
};

inhabitantSql.setup = function(db) {
    // var promise = BPromise.resolve()
    //     // insert
    //     .then(DbUtil.prepare(inhabitantSchema.insert(
    //         inhabitantSchema.name.value(""),
    //         inhabitantSchema.species_id.value("")), db))
    //     .then(function(st) {
    //         inhabitantSql._insertStatement = st;
    //     });

    // return promise;
    throw "Not implemented!";
};

inhabitantSql.insertRow = function(name, speciesId) {
    // return inhabitantSql._insertStatement.runAsync([name, speciesId])
    //     .then(function() { return this.lastID; });
    throw "Not implemented!";
};

module.exports = inhabitantSql;