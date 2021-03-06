var tables = require('../../bin/tables');
var speciesTable = tables.species;

var speciesSql = {};

speciesSql.findSpeciesByName = function(db, name) {
    var query = speciesTable.select()
        .where(speciesTable.name.equals(name)).toQuery();
    return db.queryAsync(query.text, query.values)
    	.then(function(res) {
    		return res.rows[0];
    	});
};

speciesSql.insertSpecies = function(db, name, int, dex, agi, vit) {
	var query = speciesTable.insert(
		speciesTable.name.value(name),
		speciesTable.stat_int.value(int),
		speciesTable.stat_dex.value(dex),
		speciesTable.stat_agi.value(agi),
		speciesTable.stat_vit.value(vit)
	).returning().toQuery();
    return db.queryAsync(query.text, query.values)
    	.then(function(res) {
    		return res.rows[0];
    	});
};

module.exports = speciesSql;