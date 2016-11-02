module.exports = function(tables) {

	var speciesTable = tables.species;

	var speciesSql = {};

	speciesSql.findByName = function(name, db) {
	    // var query = speciesTable.select()
	    //     .where(speciesTable.name.equals(name)).toQuery();
	    // return db.getAsync(query.text, query.values);
	    throw "Not implemented!";
	};

	return speciesSql;

};