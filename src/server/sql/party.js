module.exports = function(tables) {

    var partyTable = tables.parties;

    var partySql = {};

    partySql.insertRow = function(db) {
        // var query = partyTable.insert().toQuery();
        // return db.runAsync(query.text, query.values)
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    partySql.setStoryId = function(partyId, storyId, db) {
        // var updateObj = {};
        // updateObj[partyTable.story_id.name] = storyId;
        // var query = partyTable.update(updateObj)
        //  .where(partyTable.party_id.equals(partyId)).toQuery();
        // return db.runAsync(query.text, query.values)
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    return partySql;
};