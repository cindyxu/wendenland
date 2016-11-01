var ActionTypes = require('../action-types');
var BPromise = require('bluebird');

var actionModel = function(moveActionSql, db) {

    var _actionModel = {};

    _actionModel.create = function(storyId, actionProps) {
        switch (actionProps.type) {
            case ActionTypes.MOVE:
                return moveActionSql.insertRow(storyId, actionProps.dir, db);
            default:
                return BPromise.reject("Not implemented!");
        }
    };

    return _actionModel;

};

module.exports = actionModel;