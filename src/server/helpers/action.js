var ActionTypes = require('../action-types');
var BPromise = require('bluebird');

module.exports = function(moveActionSql, db) {

    var actionHelper = {};

    actionHelper.create = function(storyId, actionProps) {
        switch (actionProps.type) {
            case ActionTypes.MOVE:
                return moveActionSql.insertRow(storyId, actionProps.dir, db);
            default:
                return BPromise.reject("Not implemented!");
        }
    };

    return actionHelper;

};