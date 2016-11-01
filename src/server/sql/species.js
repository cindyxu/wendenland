module.exports = function(schemas) {

	var speciesSchema = schemas.species;

	var speciesSql = {};

	speciesSql.findByName = function(name, db) {
	    // var query = speciesSchema.select()
	    //     .where(speciesSchema.name.equals(name)).toQuery();
	    // return db.getAsync(query.text, query.values);
	    throw "Not implemented!";
	};

	return speciesSql;

};