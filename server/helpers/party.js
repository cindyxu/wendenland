var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

module.exports = function(storySql, partySql, db) {

    var partyHelper = {};

    partyHelper.movePartyToStory = function(id, storyId, db) {
        return partySql.setPartyStoryId(id, storyId, db);
    };

    return partyHelper;

};