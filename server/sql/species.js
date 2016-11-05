module.exports = function(tables) {

	var speciesTable = tables.species;

	var speciesSql = {};

	speciesSql.findSpeciesByName = function(name, db) {
	    var query = speciesTable.select()
	        .where(speciesTable.name.equals(name)).toQuery();
	    return db.queryAsync(query.text, query.values)
	    	.then(function(res) {
	    		return res.rows[0];
	    	});
	};

	return speciesSql;

};