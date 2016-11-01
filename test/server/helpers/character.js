var _ = require('lodash');

var BPromise = require('bluebird');
var sinon = require('sinon');

var chai = require('chai'),
    assert = chai.assert;

var Errors = require('../../../src/server/errors');

var schemas = require('../../../src/server/db/schemas');
var db = BPromise.promisifyAll(require('../stubdb'));

describe('characterHelper', function() {

    var speciesSql = require('../../../src/server/sql/species')(schemas);
    var inhabitantSql = require('../../../src/server/sql/inhabitant')(schemas);
    var partySql = require('../../../src/server/sql/party')(schemas);
    var characterSql = require('../../../src/server/sql/character')(schemas);

    var inhabitantHelper = require('../../../src/server/helpers/inhabitant')(
        speciesSql, partySql, inhabitantSql, db);
    var characterHelper = require('../../../src/server/helpers/character')(
        inhabitantHelper, characterSql, db);

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
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
                return Promise.resolve(TEST_PARTY_ID);
            });

            sandbox.stub(inhabitantSql, 'insertRow',
                function(name, speciesId, str, dex, int, luk, db) {

                if (speciesId === TEST_SPECIES_ID) {
                    return Promise.resolve(TEST_INHABITANT_ID); }
                else return Promise.reject();
            });

            sandbox.stub(characterSql, 'insertRow',
                function(userId, inhabitantId, db) {

                if (userId === TEST_USER_ID &&
                    inhabitantId === TEST_INHABITANT_ID) {
                    return Promise.resolve(TEST_CHARACTER_ID); }
                return Promise.reject();
            });
        });

        it("should return errors on missing character name", function() {
            return characterHelper.create(undefined, TEST_USER_ID, db)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.CHARACTER_NAME_NOT_GIVEN);
                });
        });

        it("should return errors on invalid user id", function(done) {
            characterHelper.create(TEST_CHARACTER_NAME, 132, db)
                .catch(function(e) {
                    done();
                });
        });

        it("should create a character with given name under given user",
            function() {
            return characterHelper.create("testcharacter", TEST_USER_ID, db)
                .then(function(characterId) {
                    assert.equal(characterId, TEST_CHARACTER_ID);
                });
        });
    });

});
