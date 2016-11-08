var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

module.exports = function(pageSql, storySql, partyHelper, actionHelper) {

  var storyHelper = {};

  storyHelper.createStorySeq = function(
    tr, partyId, pageTexts, parentId, actionProps, waypointId) {

    var partyId;
    var story;

    var actionType = actionProps ? actionProps.type : undefined;
    return storySql.insertStory(tr, partyId, parentId, actionType, waypointId)

      // add the pages to the database under new story
      .then(function(resStory) {
        story = resStory;
        return pageSql.insertPages(tr, pageTexts, story.id);
      })

      // add the action to the database under new story
      .then(function() {
        if (actionProps) {
          return actionHelper.createAction(tr, story.id, actionProps);
        } else return BPromise.resolve();
      })

      // party is now on new story
      .then(function() {
        return partyHelper.movePartyToStory(tr, partyId, story.id);
      })            

      .then(function() {
        return story;
      });
  };

  return storyHelper;

};