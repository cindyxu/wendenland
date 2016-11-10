var BPromise = require('bluebird');
var chai = require('chai'),
  assert = chai.assert;

var tables = require('../../../bin/tables');
var Errors = require('../../../server/errors');

var speciesSql = require('../../../server/sql/species');
var userSql = require('../../../server/sql/user');
var inhabitantHelper = require('../../../server/helpers/inhabitant');

module.exports = function(client, sandbox) {

  var characterHelper = require('../../../server/helpers/character');

  describe("#createCharacterSeq", function() {

    var testUserId;
    var TEST_CHARACTER_NAME = "testchar";
    var testSpecies;

    beforeEach(function() {

      return speciesSql.insertSpecies(client, "traveller", 0, 0, 0, 0)
        .then(function(species) {
          testSpecies = species;
          return userSql.insertUser(client, "testuser", "testhash");
        })

        .then(function(user) {
          testUserId = user.id;
        });
    });

    it("should return errors on missing character name", function() {
      return characterHelper.createCharacterSeq(
        client, undefined, testSpecies, testUserId)
        .then(assert.fail)
        .catch(function(e) {
          assert.equal(e, Errors.CHARACTER_NAME_NOT_GIVEN);
        });
    });

    it("should return errors on missing species", function(done) {
      characterHelper.createCharacterSeq(
        client, TEST_CHARACTER_NAME, undefined, testUserId)
        .catch(function(e) {
          done();
        });
    });

    it("should return errors on invalid user id", function(done) {
      characterHelper.createCharacterSeq(
        client, TEST_CHARACTER_NAME, testSpecies, testUserId+1)
        .catch(function(e) {
          done();
        });
    });

    describe("with valid character name and user id", function() {

      var character;
      beforeEach(function() {
        return characterHelper.createCharacterSeq(
          client, TEST_CHARACTER_NAME, testSpecies, testUserId)
          .then(function(resCharacter) {
            character = resCharacter;
          });
      });

      it("should create a character with given user", function() {
        assert.equal(character.user_id, testUserId);
      });

      it("should create an inhabitant with given name", function() {
        var inhabitantQuery = tables.inhabitants.select().where(
          tables.inhabitants.name.equals(TEST_CHARACTER_NAME))
          .toQuery();
        return client.queryAsync(inhabitantQuery.text, inhabitantQuery.values)
          .then(function(res) {
            assert.equal(res.rows.length, 1);
            assert.equal(res.rows[0].id, character.inhabitant_id);
            assert.equal(res.rows[0].name, TEST_CHARACTER_NAME);
          });
      });
    });
  });
};