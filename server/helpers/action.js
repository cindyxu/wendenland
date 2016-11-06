var ActionTypes = require('../action-types');
var BPromise = require('bluebird');
var actionSql = require('../sql/action');

var actionHelper = {};

actionHelper.createAction = function(db, storyId, actionProps) {
  
  switch (actionProps.type) {

    case ActionTypes.MOVE:
      return actionSql.insertMoveAction(
        db, storyId, actionProps.fromWaypointId, actionProps.toWaypointId,
        actionProps.isSuccess);
        
    case ActionTypes.CHIRP:
      return actionSql.insertChirpAction(db, storyId);

    default:
      return BPromise.reject("Not implemented!");
  }
};

module.exports = actionHelper;