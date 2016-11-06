module.exports = function(tables) {

	var chirpActionTable = tables.chirp_actions;
	var moveActionTable = tables.move_actions;

	var actionSql = {};

	actionSql.insertMoveAction = function(db, storyId, dir) {
	    var query = moveActionTable.insert(
	            moveActionTable.story_id.value(storyId),
	            moveActionTable.dir.value(dir)
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

	return actionSql;

};