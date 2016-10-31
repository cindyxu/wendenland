var schemas = require("../db/schemas");
var inhabitantSchema = schemas.inhabitants;

var inhabitantSql = {};

inhabitantSql.insertRow = function(
    name, speciesId, partyId, str, dex, int, luk, db) {
    // var query = inhabitantSchema.insert(
    //         inhabitantSchema.name.value(name),
    //         inhabitantSchema.species_id.value(speciesId),
    //         inhabitantSchema.stat_str.value(str),
    //         inhabitantSchema.stat_dex.value(dex),
    //         inhabitantSchema.stat_int.value(int),
    //         inhabitantSchema.stat_luk.value(luk)
    //     ).toQuery();
    // return db.runAsync(query.text, query.values)
    //     .then(function() { return this.lastID; });
    throw "Not implemented!";
};

module.exports = inhabitantSql;