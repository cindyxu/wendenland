var schemas = require("../db/schemas");
var characterSchema = schemas.characters;

var characterSql = {};

characterSql.insertRow = function(userId, inhabitantId, db) {
    // var query = characterSchema.insert(
    //         characterSchema.user_id.value(userId),
    //         characterSchema.inhabitant_id.value(inhabitantId)
    //         ).toQuery();
    // return db.runAsync(query.text, query.values)
    //     .then(function() { return this.lastID; });
    throw "Not implemented!";
};

module.exports = characterSql;