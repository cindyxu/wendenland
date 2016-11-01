var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

var partyModel = function(storySql, partySql, db) {

    var _partyModel = {};

    _partyModel.moveToStory = function(id, storyId, db) {
        return partySql.setStoryId(id, storyId, db);
    };

    return _partyModel;

};

module.exports = partyModel;