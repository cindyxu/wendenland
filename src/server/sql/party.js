module.exports = function(schemas) {

    var partySchema = schemas.parties;

    var partySql = {};

    partySql.insertRow = function(db) {
    	// var query = partySchema.insert().toQuery();
        // return db.runAsync(query.text, query.values)
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    partySql.setStoryId = function(partyId, storyId, db) {
    	// var updateObj = {};
    	// updateObj[partySchema.story_id.name] = storyId;
    	// var query = partySchema.update(updateObj)
    	// 	.where(partySchema.party_id.equals(partyId)).toQuery();
        // return db.runAsync(query.text, query.values)
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    return partySql;
};