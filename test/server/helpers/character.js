var BPromise = require('bluebird');
var chai = require('chai'),
  assert = chai.assert;

var Errors = require('../../../server/errors');

module.exports = function(tables, client, sandbox) {

  console.log("CHARACTER client " + client);

  var userSql =
    require('../../../server/sql/user')(tables);
  var speciesSql =
    require('../../../server/sql/species')(tables);
  var inhabitantSql =
    require('../../../server/sql/inhabitant')(tables);
  var partySql = require('../../../server/sql/party')(tables);
  var characterSql =
    require('../../../server/sql/character')(tables);

  var inhabitantHelper = 
    require('../../../server/helpers/inhabitant')(
      partySql, inhabitantSql, client);
  var characterHelper = require('../../../server/helpers/character')(
    speciesSql, characterSql, inhabitantHelper, client);

  describe("#createCharacterSeq", function() {

    var testUserId;
    var TEST_CHARACTER_NAME = "testchar";
    var testSpecies;

    beforeEach(function() {

      var speciesTable = tables.species;
      var userTable = tables.users;

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