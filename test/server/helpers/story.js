var BPromise = require('bluebird');
var chai = require('chai'),
  assert = chai.assert;

var Errors = require('../../../server/errors');

module.exports = function(tables, client, sandbox) {

  var pageSql = require('../../../server/sql/page')(tables);
  var storySql = require('../../../server/sql/story')(tables);
  var partySql = require('../../../server/sql/party')(tables);
  var actionSql = require('../../../server/sql/action')(tables);

  var actionHelper = require('../../../server/helpers/action')(
    actionSql, client);
  var partyHelper = require('../../../server/helpers/party')(
    storySql, partySql, client);
  var storyHelper = require('../../../server/helpers/story')(
    pageSql, storySql, partyHelper, actionHelper, client);

  describe("#advanceStory", function() {
    
    var TEST_ACTION = { "type": "move", "dir": "north" };
    var TEST_PAGE_1_TEXT = "You push the door. It creaks open.";
    var TEST_PAGE_2_TEXT = "It's dark inside.";

    var testPartyId;
    var testParent;

    beforeEach(function() {
      var partyQuery = tables.parties.insert({}).returning().toQuery();
      return client.queryAsync(partyQuery.text, partyQuery.values)
        .then(function(res) {
          testPartyId = res.rows[0].id;
          var parentQuery = tables.stories.insert(
            tables.stories.party_id.value(testPartyId)
          ).returning().toQuery();
          return client.queryAsync(parentQuery.text, parentQuery.values)
            .then(function(res) {
              testParent = res.rows[0];
            });
        });
    });

    it("should create a story with given pages and actions", function() {

      var newStory;
      return storyHelper.advanceStorySeq(testParent,
        TEST_ACTION, [TEST_PAGE_1_TEXT, TEST_PAGE_2_TEXT], client)
        .then(function(resStory) {
          assert(resStory);
          newStory = resStory;
        })

        // assert that we added two pages
        .then(function() {
          var pagesQuery = tables.pages.select().where(
            tables.pages.story_id.equals(newStory.id)).toQuery();
          return client.queryAsync(pagesQuery.text, pagesQuery.values);
        })
        .then(function(res) {
          assert.equal(res.rows.length, 2);
          assert.equal(res.rows[0].content, TEST_PAGE_1_TEXT);
          assert.equal(res.rows[1].content, TEST_PAGE_2_TEXT);
        })

        // assert that we added an action
        .then(function() {
          var actionQuery = tables.move_actions.select().where(
            tables.move_actions.story_id.equals(newStory.id)).toQuery();
          return client.queryAsync(actionQuery.text, actionQuery.values);
        })
        .then(function(res) {
          assert.equal(res.rows.length, 1);
          assert.equal(res.rows[0].dir, "north");
        })

        // assert that party is now on new story
        .then(function() {
          var partyQuery = tables.parties.select()
            .where(tables.parties.id.equals(testPartyId))
            .toQuery();
            return client.queryAsync(partyQuery.text, partyQuery.values);
        })
        .then(function(res) {
          assert.equal(res.rows[0].story_id, newStory.id);
        });
    });
  });
};
