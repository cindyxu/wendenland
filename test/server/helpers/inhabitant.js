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

  var inhabitantHelper = 
    require('../../../server/helpers/inhabitant')(
      partySql, inhabitantSql, client);

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