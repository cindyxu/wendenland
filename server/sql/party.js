module.exports = function(tables) {

    var partyTable = tables.parties;

    var partySql = {};

    partySql.insertParty = function(db) {
        var query = partyTable.insert({}).returning().toQuery();
        return db.queryAsync(query.text)
            .then(function(res) {
                return res.rows[0];
            });
    };

    partySql.setPartyStoryId = function(partyId, storyId, db) {
        var updateObj = {};
        updateObj[partyTable.story_id.name] = storyId;
        var query = partyTable.update(updateObj)
         .where(partyTable.id.equals(partyId)).toQuery();
        return db.queryAsync(query.text, query.values)
            .then(function(res) {
                return;
            });
    };

    return partySql;
};