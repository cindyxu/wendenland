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

    beforeEach(function() {

      var speciesTable = tables.species;
      var userTable = tables.users;

      return speciesSql.insertSpecies("traveller", 0, 0, 0, 0, client)

        .then(function(species) {
          return userSql.insertUser("testuser", "testhash", client);
        })

        .then(function(user) {
          testUserId = user.id;
        });
    });

    it("should return errors on missing character name", function() {
      return characterHelper.createCharacterSeq(
        undefined, testUserId, client)
        .then(assert.fail)
        .catch(function(e) {
          assert.equal(e, Errors.CHARACTER_NAME_NOT_GIVEN);
        });
    });

    it("should return errors on invalid user id", function(done) {
      characterHelper.createCharacterSeq(
        TEST_CHARACTER_NAME, testUserId+1, client)
        .catch(function(e) {
          done();
        });
    });

    describe("with valid character name and user id", function() {

      var character;
      beforeEach(function() {
        return characterHelper.createCharacterSeq(
          TEST_CHARACTER_NAME, testUserId, client)
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