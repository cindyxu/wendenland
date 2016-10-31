var schemas = require("../db/schemas");
var partySchema = schemas.parties;

var partySql = {};

partySql.insertRow = function(db) {
	// var query = partySchema.insert().toQuery();
    // return db.runAsync(query.text, query.values)
    //     .then(function() { return this.lastID; });
    throw "Not implemented!";
};

module.exports = partySql;