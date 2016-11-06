var ActionTypes = require('../action-types');
var BPromise = require('bluebird');

module.exports = function(actionSql) {

    var actionHelper = {};

    actionHelper.createAction = function(db, storyId, actionProps) {
        switch (actionProps.type) {
            case ActionTypes.MOVE:
                return actionSql.insertMoveAction(
                    db, storyId, actionProps.dir);
            case ActionTypes.CHIRP:
                return actionSql.insertChirpAction(
                    db, storyId);
            default:
                return BPromise.reject("Not implemented!");
        }
    };

    return actionHelper;

};