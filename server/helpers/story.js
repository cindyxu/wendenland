var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

module.exports = function(pageSql, storySql, partyHelper, actionHelper) {

    var storyHelper = {};

    storyHelper.createStorySeq = function(
        partyId, pageTexts, parentId, actionProps, waypointId, tr) {

        var partyId;
        var story;

        var actionType = actionProps ? actionProps.type : undefined;
        return storySql.insertStory(
            partyId, parentId, actionType, waypointId, tr)

            // add the pages to the database under new story
            .then(function(resStory) {
                story = resStory;
                return pageSql.insertPages(pageTexts, story.id, tr);
            })

            // add the action to the database under new story
            .then(function() {
                if (actionProps) {
                    return actionHelper.createAction(story.id, actionProps, tr);
                } else return BPromise.resolve();
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