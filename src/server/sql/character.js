module.exports = function(tables) {

	var characterTable = tables.characters;

	var characterSql = {};

	characterSql.insertCharacter = function(userId, inhabitantId, db) {
	    // var query = characterTable.insert(
	    //         characterTable.user_id.value(userId),
	    //         characterTable.inhabitant_id.value(inhabitantId)
	    //         ).toQuery();
	    // return db.runAsync(query.text, query.values)
	    //     .then(function() { return this.lastID; });
	    throw "Not implemented!";
	};

	return characterSql;

};