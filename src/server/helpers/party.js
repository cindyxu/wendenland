var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

module.exports = function(storySql, partySql, db) {

    var partyHelper = {};

    partyHelper.moveToStory = function(id, storyId, db) {
        return partySql.setStoryId(id, storyId, db);
    };

    return partyHelper;

};