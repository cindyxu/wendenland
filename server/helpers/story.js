var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

module.exports = function(pageSql, storySql, partyHelper, actionHelper, db) {

    var storyHelper = {};

    storyHelper.advanceStorySeq = function(
        parent, actionProps, pageTexts, db) {

        var partyId;
        var story;
        var action;

        partyId = parent.party_id;
        return storySql.insertStory(
            parentId, partyId, actionProps.type)

            // add the pages to the database under new story
            .then(function(resStory) {
                story = resStory;
                return pageSql.insertPages(pageTexts, story.id);
            })

            // add the action to the database under new story
            .then(function() {
                return actionHelper.createAction(story.id, actionProps);
            })

            // party is now on new story
            .then(function() {
                return partyHelper.movePartyToStory(partyId, story.id);
            })            

            .then(function() {
                return story;
            });
    };

    return storyHelper;

};