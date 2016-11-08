var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

module.exports = function(storySql, partySql) {

    var partyHelper = {};

    partyHelper.movePartyToStory = function(db, id, storyId) {
        return partySql.setPartyStoryId(db, id, storyId);
    };

    return partyHelper;

};