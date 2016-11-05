module.exports = function(tables) {

	var moveActionTable = tables.move_actions;

	var actionSql = {};

	actionSql.insertMoveAction = function(storyId, dir, db) {
	    var query = moveActionTable.insert(
	            moveActionTable.storyId.value(storyId),
	            moveActionTable.dir.value(dir)
	        ).returning().toQuery();
	    return db.queryAsync(query.text, query.values)
	    	.then(function(res) {
                return res.rows[0];
            });
	};

	return actionSql;

};