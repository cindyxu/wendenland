var BPromise = require('bluebird');

var Errors = require('../errors');

var storyController = function(storyModel) {

    var storyController = {};

    storyController.takeAction = function(storyId, action) {
        return storyModel.findById(storyId)
            .then(function(story) {
                var pages = storyController._generateStoryPages(
                    story, action);
                return story.advance(action, pages);
    };

    storyController._generateStoryPages = function(story, action) {
        return [];
    };

    return storyController;

};

module.exports = storyController;