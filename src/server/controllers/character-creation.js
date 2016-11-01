var BPromise = require('bluebird');

var Errors = require('../errors');

var characterCreationController = function(characterHelper) {

    var characterCreationController = {};

    characterCreationController.create = function(name, userId) {
        return characterHelper.create(name, userId);
    };

    return characterCreationController;

};

module.exports = characterCreationController;