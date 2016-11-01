var schemas = require("../db/schemas");
var storySchema = schemas.stories;

var storySql = {};

storySql.findById = function(storyId, db) {
    // var query = storySchema.select().where(storySchema.id.equals(storyId))
    //     .toQuery();
    // return db.getAsync(query.text, query.values);
    throw "Not implemented!";
};

storySql.insertRow = function(parentId, partyId, actionType, db) {
    // var query = storySchema.insert(
    //         storySchema.parent_id.value(parentId),
    //         storySchema.party_id.value(partyId),
    //         storySchema.action_type.value(actionType)
    //         ).toQuery();
    // return db.runAsync(query.text, query.values)
    //     .then(function() { return this.lastID; });
    throw "Not implemented!";
};

module.exports = storySql;