var tables = require('../../bin/tables');
var chirpActionTable = tables.chirp_actions;
var moveActionTable = tables.move_actions;

var actionSql = {};

actionSql.insertMoveAction = function(
	db, storyId, fromWaypointId, toWaypointId, isSuccess) {
    var query = moveActionTable.insert(
            moveActionTable.story_id.value(storyId),
            moveActionTable.from_waypoint_id.value(fromWaypointId),
            moveActionTable.to_waypoint_id.value(toWaypointId),
            moveActionTable.is_success.value(isSuccess)
        ).returning().toQuery();
    return db.queryAsync(query.text, query.values)
    	.then(function(res) {
            return res.rows[0];
        });
};

actionSql.insertChirpAction = function(db, storyId) {
    var query = chirpActionTable.insert(
            chirpActionTable.story_id.value(storyId)
        ).returning().toQuery();
    return db.queryAsync(query.text, query.values)
    	.then(function(res) {
            return res.rows[0];
        });
};

module.exports = actionSql;