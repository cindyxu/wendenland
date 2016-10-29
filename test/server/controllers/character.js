var BPromise = require('bluebird');
var sinon = require('sinon');

var chai = require('chai'),
    assert = chai.assert;

var Errors = require('../../../src/server/errors');

describe('characterController', function() {

    var userSql;
    var characterSql;

    var characterController;

    before(function() {
        userSql = require('../../../src/server/sql/user');
        characterSql = require('../../../src/server/sql/character');

        characterController = require('../../../src/server/controllers/character')(characterSql);
    });

    describe("#create", function() {

        var TEST_USER_ID = 123;
        var TEST_CHARACTER_NAME = "testcharacter";
        var TEST_CHARACTER_ID = 456;

        before(function() {
            sinon.stub(characterSql, 'create', function(name, userId) {
                if (userId === TEST_USER_ID) return Promise.resolve(TEST_CHARACTER_ID);
                return Promise.reject(Errors.USER_DOES_NOT_EXIST);
            });
        });

        it("should return errors on missing character name", function() {
            return characterController.create(undefined, TEST_USER_ID)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.CHARACTER_NAME_NOT_GIVEN);
                });
        });

        it("should return errors on invalid user id", function() {
            return characterController.create(TEST_CHARACTER_NAME, 132)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.USER_DOES_NOT_EXIST);
                });
        });

        it("should create a character with given name under given user", function() {
            return characterController.create("testcharacter", TEST_USER_ID)
                .then(function(id) {
                    assert.equal(id, TEST_CHARACTER_ID);
                });
        });
    });

});
