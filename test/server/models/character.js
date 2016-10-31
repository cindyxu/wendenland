var BPromise = require('bluebird');
var sinon = require('sinon');

var chai = require('chai'),
    assert = chai.assert;

var Errors = require('../../../src/server/errors');

var db = BPromise.promisifyAll(require('../stubdb'));

describe('characterModel', function() {

    var speciesSql = require('../../../src/server/sql/species');
    var inhabitantSql = require('../../../src/server/sql/inhabitant');
    var partySql = require('../../../src/server/sql/party');
    var characterSql = require('../../../src/server/sql/character');

    var inhabitantModel = require('../../../src/server/models/inhabitant')(
        speciesSql, partySql, inhabitantSql, db);
    var characterModel = require('../../../src/server/models/character')(
        inhabitantModel, characterSql, db);

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    })

    describe("#create", function() {

        var TEST_USER_ID = 123;
        var TEST_CHARACTER_NAME = "testcharacter";

        var TEST_SPECIES_ID = 234;
        var TEST_PARTY_ID = 345;
        var TEST_INHABITANT_ID = 456;
        var TEST_CHARACTER_ID = 567;

        beforeEach(function() {
            // pretend we have a "traveller" species
            sandbox.stub(speciesSql, 'findByName', function(name, db) {

                if (name === "traveller") {
                    return Promise.resolve({ id: TEST_SPECIES_ID }); }
                else return Promise.reject();
            });

            sandbox.stub(partySql, 'insertRow', function() {
                return Promise.resolve({ id: TEST_PARTY_ID });
            });

            sandbox.stub(inhabitantSql, 'insertRow',
                function(name, speciesId, str, dex, int, luk, db) {

                if (speciesId === TEST_SPECIES_ID) {
                    return Promise.resolve({ id: TEST_INHABITANT_ID }); }
                else return Promise.reject();
            });

            sandbox.stub(characterSql, 'insertRow',
                function(userId, inhabitantId, db) {

                if (userId === TEST_USER_ID &&
                    inhabitantId === TEST_INHABITANT_ID) {
                    return Promise.resolve({ id: TEST_CHARACTER_ID }); }
                return Promise.reject();
            });
        });

        it("should return errors on missing character name", function() {
            return characterModel.create(undefined, TEST_USER_ID, db)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.CHARACTER_NAME_NOT_GIVEN);
                });
        });

        it("should return errors on invalid user id", function(done) {
            characterModel.create(TEST_CHARACTER_NAME, 132, db)
                .catch(function(e) {
                    done();
                });
        });

        it("should create a character with given name under given user",
            function() {
            return characterModel.create("testcharacter", TEST_USER_ID, db)
                .then(function(character) {
                    assert.equal(character.id, TEST_CHARACTER_ID);
                    assert.equal(character.inhabitant.id, TEST_INHABITANT_ID);
                });
        });
    });

});
