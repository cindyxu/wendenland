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

	speciesSql.insertSpecies = function(name, str, dex, int, luk, db) {
		var query = speciesTable.insert(
			speciesTable.name.value(name),
			speciesTable.stat_str.value(str),
			speciesTable.stat_dex.value(dex),
			speciesTable.stat_int.value(int),
			speciesTable.stat_luk.value(luk)
		).toQuery();
	    return db.queryAsync(query.text, query.values)
	    	.then(function(res) {
	    		return res.rows[0];
	    	});
	};

	return speciesSql;

};