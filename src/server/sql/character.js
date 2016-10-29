var sinon = require('sinon');
var BPromise = require('bluebird');

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var characterSchema = schemas.characters;

var characterSql = {
    _createStatement : undefined
};

characterSql.setup = function(db) {
    // var promise = BPromise.resolve()
    //     // create
    //     .then(DbUtil.prepare(characterSchema.insert(
    //         characterSchema.name.value(""),
    //         characterSchema.user_id.value("")), db))
    //     .then(function(st) {
    //         characterSql._createStatement = st;
    //     });

    // return promise;
    throw "Not implemented!";
};

characterSql.create = function(name, userId) {
    // return characterSql._createStatement.runAsync([name, userId])
    //     .then(function() { return this.lastID });
    throw "Not implemented!";
};

module.exports = characterSql;