var BPromise = require('bluebird');

var Errors = require('../errors');

var characterCreationController = function(characterModel) {

    var characterCreationController = {};

    characterCreationController.create = function(name, userId) {
        return characterModel.create(name, userId);
    };

    return characterCreationController;

};

module.exports = characterCreationController;