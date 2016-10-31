var ActionTypes = require('../action-types');
var BPromise = require('bluebird');

var actionModel = function(moveActionSql, db) {

    var _actionModel = function(id) {
        this.id = id;
        this.storyId = storyId;
    };

    var _moveModel = function(id, storyId, dir) {
        _actionModel.call(this, id, storyId);
        this.dir = dir;
    };
    _moveModel.prototype = Object.create(_actionModel.prototype);

    /* static methods */

    _actionModel.create = function(storyId, actionProps) {
        switch (actionProps.type) {
            case ActionTypes.MOVE:
                return moveActionSql.insertRow(storyId, actionProps.dir);
            default:
                return BPromise.reject("Not implemented!");
        }
    };

    return _actionModel;

};

module.exports = actionModel;