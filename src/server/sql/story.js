var schemas = require("../db/schemas");
var storySchema = schemas.stories;

var storySql = {};

storySql.insertRow = function(parentId, actionType, db) {
    // var query = storySchema.insert(
    //         storySchema.parent_id.value(parentId),
    //         storySchema.action_type.value(actionType)
    //         ).toQuery();
    // return db.runAsync(query.text, query.values)
    //     .then(function() { return this.lastID; });
    throw "Not implemented!";
};

module.exports = storySql;