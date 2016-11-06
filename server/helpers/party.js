var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

var partySql = require('../sql/party');
var storySql = require('../sql/story');

var partyHelper = {};

partyHelper.movePartyToStory = function(db, id, storyId) {
    return partySql.setPartyStoryId(db, id, storyId);
};

module.exports = partyHelper;