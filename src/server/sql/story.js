module.exports = function(tables) {

    var storyTable = tables.stories;

    var storySql = {};

    storySql.findStoryById = function(storyId, db) {
        // var query = storyTable.select().where(storyTable.id.equals(storyId))
        //     .toQuery();
        // return db.getAsync(query.text, query.values);
        throw "Not implemented!";
    };

    storySql.insertStory = function(parentId, partyId, actionType, db) {
        // var query = storyTable.insert(
        //         storyTable.parent_id.value(parentId),
        //         storyTable.party_id.value(partyId),
        //         storyTable.action_type.value(actionType)
        //         ).toQuery();
        // return db.runAsync(query.text, query.values)
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    return storySql;

};
