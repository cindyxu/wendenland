var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

var pageSql = require('../sql/page');
var storySql = require('../sql/story');
var partyHelper = require('./party');

var storyHelper = {};

// called AFTER resolving the new story.
storyHelper.createStorySeq = function(
  tr, partyId, pageTexts, waypointId, parentId, actionType, actionArgs) {

  var partyId;
  var story;

  return storySql.insertStory(
    tr, partyId, waypointId, parentId, actionType, actionArgs)

    // add the pages to the database under new story
    .then(function(resStory) {
      story = resStory;
      return pageSql.insertPages(tr, pageTexts, story.id);
    })

    // party is now on new story
    .then(function() {
      return partyHelper.movePartyToStory(tr, partyId, story.id);
    })            

    .then(function() {
      return story;
    });
};

module.exports = storyHelper;