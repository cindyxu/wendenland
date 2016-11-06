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

  describe("#createStorySeq", function() {
    
    var TEST_MAP_NAME = "testmap";
    var TEST_ACTION = { "type" : "move", "dir" : "north" };
    var TEST_PAGE_1_TEXT = "You push the door. It creaks open.";
    var TEST_PAGE_2_TEXT = "It's dark inside.";

    var testPartyId;

    beforeEach(function() {

      // create a test party
      return partySql.insertParty(client)
        .then(function(party) {
          testPartyId = party.id;
        });
    });

    describe("always", function() {

      var newStory;

      beforeEach(function() {
        return storyHelper.createStorySeq(testPartyId,
          [TEST_PAGE_1_TEXT, TEST_PAGE_2_TEXT],
          undefined, undefined, undefined, client)
          .then(function(resStory) {
            newStory = resStory;
          });
      })
      
      it("should create a new story", function() {
        assert(newStory);
      });

      it("should add pages under story", function() {
        var pagesQuery = tables.pages.select().where(
          tables.pages.story_id.equals(newStory.id)).toQuery();
        return client.queryAsync(pagesQuery.text, pagesQuery.values)
          .then(function(res) {
            assert.equal(res.rows.length, 2);
            assert.equal(res.rows[0].content, TEST_PAGE_1_TEXT);
            assert.equal(res.rows[1].content, TEST_PAGE_2_TEXT);
          });
      });

      it("should assign party to story", function() {
        var partyQuery = tables.parties.select()
          .where(tables.parties.id.equals(testPartyId))
          .toQuery();
        return client.queryAsync(partyQuery.text, partyQuery.values)
          .then(function(res) {
            assert.equal(res.rows[0].story_id, newStory.id);
          });
      });
    });

    describe("from a parent", function() {

      var TEST_ACTION = { "type" : "chirp" };
      var parentId;

      beforeEach(function() {
        // create a test parent story
        var parentQuery = tables.stories.insert(
          tables.stories.party_id.value(testPartyId)
        ).returning().toQuery();
        return client.queryAsync(parentQuery.text, parentQuery.values)
          .then(function(res) {
            testParent = res.rows[0].id;
          });
      });

      describe("always", function() {

        var newStory;
        beforeEach(function() {
          return storyHelper.createStorySeq(testPartyId,
            [TEST_PAGE_1_TEXT, TEST_PAGE_2_TEXT],
            parentId, TEST_ACTION, undefined, client)
            .then(function(resStory) {
              newStory = resStory;
            });
        });

        it("should assign parent story", function() {
          assert.equal(newStory.parent_id, parentId);
        });

        it("should create an action", function() {
          var actionQuery = tables.chirp_actions.select().where(
            tables.chirp_actions.story_id.equals(newStory.id)).toQuery();
          return client.queryAsync(actionQuery.text, actionQuery.values)
            .then(function(res) {
              assert.equal(res.rows.length, 1);
            });
        });
          // // assert that we added an action
          // .then(function() {
          //   var actionQuery = tables.move_actions.select().where(
          //     tables.move_actions.story_id.equals(newStory.id)).toQuery();
          //   return client.queryAsync(actionQuery.text, actionQuery.values);
          // })
          // .then(function(res) {
          //   assert.equal(res.rows.length, 1);
          //   assert.equal(res.rows[0].dir, "north");
          // })
      });
    });
  });
};
