var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

module.exports = function(pageSql, storySql, partyHelper, actionHelper) {

    var storyHelper = {};

    storyHelper.advanceStorySeq = function(
        parent, actionProps, pageTexts, tr) {

        var partyId;
        var story;
        var action;

        partyId = parent.party_id;
        return storySql.insertStory(
            parent.id, partyId, actionProps.type, tr)

            // add the pages to the database under new story
            .then(function(resStory) {
                story = resStory;
                return pageSql.insertPages(pageTexts, story.id, tr);
            })

            // add the action to the database under new story
            .then(function() {
                return actionHelper.createAction(story.id, actionProps, tr);
            })

            // party is now on new story
            .then(function() {
                return partyHelper.movePartyToStory(partyId, story.id, tr);
            })            

            .then(function() {
                return story;
            });
    };

    return storyHelper;

};