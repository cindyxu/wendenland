var BPromise = require('bluebird');
var chai = require('chai'),
	assert = chai.assert;

var Errors = require('../../../server/errors');

module.exports = function(tables, client, sandbox) {

	console.log("CHARACTER client " + client);

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

			console.log("character before");

			var speciesTable = tables.species;
			var userTable = tables.users;

			var insertTravellerQuery = speciesTable.insert(
				speciesTable.name.value("traveller")).toQuery();
			
			return client.queryAsync(insertTravellerQuery.text,
				insertTravellerQuery.values)

				.then(function() {
					var insertUserQuery = userTable.insert(
					userTable.username.value("testuser"),
					userTable.username.value("testpass")).returning().toQuery();
					return client.queryAsync(insertUserQuery.text,
						insertUserQuery.values)
				})

				.then(function(res) {
					testUserId = res.rows[0].id;
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

		it("should create a character with given name under given user",
			function() {
			return characterHelper.createCharacterSeq(
				TEST_CHARACTER_NAME, testUserId, client)
				
				// assert we got a character
				.then(function(character) {
					assert(character);
				})

				// assert that we also created inhabitant
				.then(function() {
					var inhabitantQuery = tables.inhabitants.select().where(
						tables.inhabitants.name.equals(TEST_CHARACTER_NAME))
						.toQuery();
					return client.queryAsync(
						inhabitantQuery.text, inhabitantQuery.values);
				})
				.then(function(res) {
					assert.equal(res.rows.length, 1);
				});
		});
	});
};