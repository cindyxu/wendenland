var BPromise = require('bluebird');
var sinon = require('sinon');

var chai = require('chai'),
    assert = chai.assert;

var Errors = require('../../../src/server/errors');

describe('characterModel', function() {

    var userSql;
    var characterSql;

    var characterModel;

    var sandbox;

    before(function() {
        userSql = require('../../../src/server/sql/user')();
        inhabitantSql = require('../../../src/server/sql/inhabitant')();
        characterSql = require('../../../src/server/sql/character')();

        characterModel = require('../../../src/server/models/character')(
            userSql, inhabitantSql, characterSql);
    });

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    })

    describe("#create", function() {

        var TEST_USER_ID = 123;
        var TEST_CHARACTER_NAME = "testcharacter";
        var TEST_CHARACTER_ID = 456;

        beforeEach(function() {
            sandbox.stub(characterSql, 'create', function(name, userId) {
                if (userId === TEST_USER_ID) return Promise.resolve({ id: TEST_CHARACTER_ID });
                return Promise.reject(Errors.USER_DOES_NOT_EXIST);
            });
        });

        it("should return errors on missing character name", function() {
            return characterModel.create(undefined, TEST_USER_ID)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.CHARACTER_NAME_NOT_GIVEN);
                });
        });

        it("should return errors on invalid user id", function() {
            return characterModel.create(TEST_CHARACTER_NAME, 132)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.USER_DOES_NOT_EXIST);
                });
        });

        it("should create a character with given name under given user", function() {
            return characterModel.create("testcharacter", TEST_USER_ID)
                .then(function(character) {
                    console.log(character);
                    assert.equal(character.id, TEST_CHARACTER_ID);
                });
        });
    });

});
