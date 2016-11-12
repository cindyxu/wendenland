var tables = require('../../bin/tables');
var storyTable = tables.stories;

var storySql = {};

storySql.findStoryById = function(db, storyId) {
  var query = storyTable.select().where(storyTable.id.equals(storyId))
    .toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return res.rows[0];
    });
};

storySql.insertStory = function(
  db, partyId, waypointId, parentId, actionType, actionArgs) {
  var query = storyTable.insert(
      storyTable.parent_id.value(parentId),
      storyTable.waypoint_id.value(waypointId),
      storyTable.party_id.value(partyId),
      storyTable.action_type.value(actionType),
      storyTable.action_args.value(actionArgs)
      ).returning().toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return res.rows[0];
    });
};

storySql.setStoryWaypointId = function(db, storyId, waypointId) {
  var updateObj = {};
  updateObj[storyTable.waypoint_id.name] = waypointId;
  var query = storyTable.update(updateObj)
   .where(storyTable.id.equals(storyId)).toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return;
    });
};

module.exports = storySql;