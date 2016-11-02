var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

module.exports = function(pageSql, storySql, partyHelper, actionHelper, db) {

    var storyHelper = {};

    storyHelper.findById = function(id) {
        return storySql.findStoryById(id, db);
    };

    storyHelper.advanceStory = function(
        parentId, actionProps, pages, db) {

        var transaction;
        var partyId;
        var storyId;
        var action;

        return db.beginTransactionAsync()

            // add the story to the database
            .then(function(resTransaction) {
                transaction = BPromise.promisifyAll(resTransaction);
                return storySql.findStoryById(parentId);
            })

            // get party id from story id
            .then(function(resParentProps) {
                partyId = resParentProps.party_id;
                return storySql.insertStory(
                    parentId, partyId, actionProps.type);
            })

            // add the pages to the database under new story
            .then(function(resStoryId) {
                storyId = resStoryId;
                return pageSql.insertPages(pages, storyId);
            })

            // add the action to the database under new story
            .then(function() {
                return actionHelper.createAction(storyId, actionProps);
            })

            // party is now on new story
            .then(function() {
                return partyHelper.movePartyToStory(partyId, storyId);
            })            

            .then(function(resAction) {
                action = resAction;
                return transaction.commitAsync(); })

            .then(function() {
                return storyId;
            })
    };

    return storyHelper;

};