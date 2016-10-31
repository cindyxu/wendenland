var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

var storyModel = function(pageSql, storySql, actionModel, db) {

    var _storyModel = function(id, parentId, actionType, action) {
        this.id = id;
        this.parentId = parentId;
        this.actionType = actionType;
        this.action = action;
    };

    /* static methods */

    _storyModel.findById = function(id) {
        return storySql.findById(id, db)
            .then(function(res) {
                return new _storyModel(res.id, res.parent_id, res.action_type);
            });
    };

    /* instance methods */

    _storyModel.prototype.advance = function(actionProps, pages, db) {
        var transaction;
        var storyProps;
        var action;

        var parentId = this.id;
        return db.beginTransactionAsync()

            // add the story to the database
            .then(function(resTransaction) {
                transaction = BPromise.promisifyAll(resTransaction);
                return storySql.insertRow(parentId, actionProps.type);
            })

            // add the pages to the database under new story
            .then(function(resStoryProps) {
                storyProps = resStoryProps;
                return pageSql.insertRows(pages, storyProps.id);
            })

            // add the action to the database under new story
            .then(function() {
                return actionModel.create(storyProps.id, actionProps);
            })

            .then(function(resAction) {
                action = resAction;
                return transaction.commitAsync(); })

            .then(function() {
                return new _storyModel(storyProps.id, parentId,
                    actionProps.type, action);
            })
    };

    return _storyModel;

};

module.exports = storyModel;