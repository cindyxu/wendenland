var sinon = require('sinon');
var BPromise = require('bluebird');

var DbUtil = require("../db/util");
var schemas = require("../db/schemas");
var characterSchema = schemas.characters;

var characterSql = function(userSql, inhabitantSql, db) {

    var characterSql = {
        _insertStatement : undefined
    };

    characterSql.setup = function() {
        // var promise = BPromise.resolve()
        //     // insert
        //     .then(DbUtil.prepare(characterSchema.insert(
        //         characterSchema.user_id.value(""),
        //         characterSchema.inhabitant_id.value("")), db))
        //     .then(function(st) {
        //         characterSql._insertStatement = st;
        //     });
        // return promise;
        throw "Not implemented!";
    };

    characterSql.create = function(name, userId) {
        var characterId;
        // atomic operation
        return db.beginTransactionAsync()
            // insert a new inhabitant of the "traveller" species
            .then(function() { return inhabitantSql.insertOfSpecies(name, "traveller" /* speciesName */); })
            // insert a character with the new inhabitant under given user
            .then(function(inhabitantId) { return characterSql.insertRow(userId, inhabitantId); })
            .then(function(resId) {
                characterId = resId;
                return db.commitAsync();
            })
            .then(function() { return { "id" : characterId, "inhabitantId" : inhabitantId }; });
    };

    characterSql.insertRow = function(userId, inhabitantId) {
        // return characterSql._insertStatement.runAsync([userId, inhabitantId])
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    return characterSql;

}
module.exports = characterSql;