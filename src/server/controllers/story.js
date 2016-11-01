var BPromise = require('bluebird');

var Errors = require('../errors');

var storyController = function(storyHelper) {

    var storyController = {};

    storyController.takeAction = function(storyId, action) {
        throw "Not implemented!";
    };

    storyController._generateStoryPages = function(story, action) {
        return [];
    };

    return storyController;

};

module.exports = storyController;