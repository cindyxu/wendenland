module.exports = function(tables) {

    var storyTable = tables.stories;

    var storySql = {};

    storySql.findStoryById = function(db, storyId) {
        var query = storyTable.select().where(storyTable.id.equals(storyId))
            .toQuery();
        return db.queryAsync(query.text, query.values)
            .then(function(res) {
                return res.rows[0];
            });
    };

    storySql.insertStory = function(
        db, partyId, parentId, actionType, waypointId) {
        var query = storyTable.insert(
                storyTable.parent_id.value(parentId),
                storyTable.party_id.value(partyId),
                storyTable.waypoint_id.value(waypointId),
                storyTable.action_type.value(actionType)
                ).returning().toQuery();
        return db.queryAsync(query.text, query.values)
            .then(function(res) {
                return res.rows[0];
            });
    };

    return storySql;

};
