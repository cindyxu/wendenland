var tables = require('../../bin/tables');
var partyTable = tables.parties;

var partySql = {};

partySql.insertParty = function(db) {
  var query = partyTable.insert({}).returning().toQuery();
  return db.queryAsync(query.text)
    .then(function(res) {
      return res.rows[0];
    });
};

partySql.findPartyById = function(db, partyId) {
  var query = partyTable.select().where(partyTable.id.equals(partyId))
    .toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return res.rows[0];
    });
};

partySql.setPartyStoryId = function(db, partyId, storyId) {
  var updateObj = {};
  updateObj[partyTable.story_id.name] = storyId;
  var query = partyTable.update(updateObj)
   .where(partyTable.id.equals(partyId)).toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return;
    });
};

module.exports = partySql;