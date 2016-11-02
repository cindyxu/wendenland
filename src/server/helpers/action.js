var ActionTypes = require('../action-types');
var BPromise = require('bluebird');

module.exports = function(actionSql, db) {

    var actionHelper = {};

    actionHelper.createAction = function(storyId, actionProps) {
        switch (actionProps.type) {
            case ActionTypes.MOVE:
                return actionSql.insertMoveAction(
                    storyId, actionProps.dir, db);
            default:
                return BPromise.reject("Not implemented!");
        }
    };

    return actionHelper;

};