var BPromise = require('bluebird');
var chai = require('chai'),
  assert = chai.assert;

var tables = require('../../../bin/tables');
var Errors = require('../../../server/errors');

var speciesSql = require('../../../server/sql/species');

module.exports = function(client, sandbox) {

  var inhabitantHelper = require('../../../server/helpers/inhabitant');

  describe("#createInhabitantSeq", function() {

    var TEST_INHABITANT_NAME = "testnpc";
    var testInhabitant;
    var testSpecies;

    beforeEach(function() {

      var speciesTable = tables.species;

      return speciesSql.insertSpecies(client, "traveller", 0, 0, 0, 0)
        .then(function(species) {
          testSpecies = species;
          return inhabitantHelper.createInhabitantSeq(
            client, TEST_INHABITANT_NAME, species);
        })
        .then(function(resInhabitant) {
          testInhabitant = resInhabitant;
        });
    });

    it("should create an inhabitant with given species and name", function() {
      assert.equal(testInhabitant.species_id, testSpecies.id);
      assert.equal(testInhabitant.name, TEST_INHABITANT_NAME);
    });

    it("should create an empty party", function() {
      assert.isNotNaN(testInhabitant.party_id);
    });

  });
};