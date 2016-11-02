module.exports = function(tables) {

	var moveActionTable = tables.move_actions;

	var moveActionSql = {};

	moveActionSql.insertRow = function(storyId, dir, db) {
	    // var query = moveActionTable.insert(
	    //         moveActionTable.storyId.value(storyId),
	    //         moveActionTable.dir.value(dir)
	    //     ).toQuery();
	    // return db.runAsync(query.text, query.values)
	    //     .then(function() { return this.lastID; });
	    throw "Not implemented!";
	};

	return moveActionSql;

};