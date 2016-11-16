var BPromise = require('bluebird');
var chai = require('chai'),
  assert = chai.assert;

var tables = require('../../../bin/tables');
var Errors = require('../../../server/errors');

var partySql = require('../../../server/sql/party');
var mapSql = require('../../../server/sql/map');
var decisionTreeSql = require('../../../server/sql/decision-tree');

var partyHelper = require('../../../server/helpers/party');

module.exports = function(client, sandbox) {
  
  var storyHelper = require('../../../server/helpers/story');

  describe("#createStorySeq", function() {
    
    var TEST_PAGE_1_TEXT = "You push the door. It creaks open.";
    var TEST_PAGE_2_TEXT = "It's dark inside.";

    var TEST_MAP_NAME = "testmap";
    var map;
    var TEST_WAYPOINT_1_NAME = "testwaypoint1";
    var testwaypoint1;

    var testPartyId;
    var testTreeId;

    beforeEach(function() {
      // create a test party
      return partySql.insertParty(client)
        .then(function(party) {
          testPartyId = party.id;

          // create a test map
          return mapSql.insertMap(client, TEST_MAP_NAME, 0, 0, 0, 0);
        })
        .then(function(resMap) {
          map = resMap;

          // create test decision tree
          return client.queryAsync('SET CONSTRAINTS has_root_node DEFERRED');
        })
        .then(function() {
          return decisionTreeSql.insertTreeWithRootNode(client);
        })
        .then(function(resTree) {
          testTreeId = resTree.id;

          // create a test waypoint
          return mapSql.insertWaypoint(
            client, map.id, TEST_WAYPOINT_1_NAME, 0, 0, testTreeId);
        })
        .then(function(resWaypoint) {
          testwaypoint1 = resWaypoint;
        });
    });

    describe("always", function() {

      var newStory;

      beforeEach(function() {
        return storyHelper.createStorySeq(client, testPartyId,
          [TEST_PAGE_1_TEXT, TEST_PAGE_2_TEXT])
          .then(function(resStory) {
            newStory = resStory;
          });
      });
      
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

      var TEST_ACTION_TYPE = 'testaction';
      var TEST_ACTION_ARGS = ['testactionarg'];
      var testParentId;

      beforeEach(function() {

        // create action type
        var actionQuery = tables.action_types.insert(
          tables.action_types.type.value(TEST_ACTION_TYPE)).toQuery();
        return client.queryAsync(actionQuery.text, actionQuery.values)
          .then(function() {

            // create a test parent story
            var parentQuery = tables.stories.insert(
              tables.stories.party_id.value(testPartyId),
              tables.stories.waypoint_id.value(testwaypoint1.id)
            ).returning().toQuery();
            return client.queryAsync(parentQuery.text, parentQuery.values);
          })
          .then(function(res) {
            testParentId = res.rows[0].id;
          });

      });

      describe("always", function() {

        var newStory;
        beforeEach(function() {
          return storyHelper.createStorySeq(client, testPartyId,
            [TEST_PAGE_1_TEXT, TEST_PAGE_2_TEXT], undefined /* waypointId */,
            testParentId, TEST_ACTION_TYPE, TEST_ACTION_ARGS)
            .then(function(resStory) {
              newStory = resStory;
            });
        });

        it("should assign parent story", function() {
          assert.equal(newStory.parent_id, testParentId);
        });

        it("should assign action type and args", function() {
          assert.equal(newStory.action_type, TEST_ACTION_TYPE);
          assert.deepEqual(newStory.action_args, TEST_ACTION_ARGS);
        });
      });

      // describe("with move action", function() {

      //   var TEST_WAYPOINT_2_NAME = "testwaypoint2";
      //   var testwaypoint2;
      //   var testPath;

      //   beforeEach(function() {
      //     return mapSql.insertWaypoint(
      //       client, map.id, TEST_WAYPOINT_2_NAME, 0, 0, 0, 0)
      //       .then(function(resWaypoint) {
      //         testwaypoint2 = resWaypoint;
      //         return mapSql.insertPath(
      //           client, testwaypoint1.id, testwaypoint2.id, "north");
      //       })
      //       .then(function(resPath) {
      //         testPath = resPath;
      //         var moveAction = {
      //           "type" : ActionTypes.MOVE,
      //           "fromWaypointId" : testwaypoint1.id,
      //           "toWaypointId" : testwaypoint2.id,
      //           "isSuccess" : false
      //         };
      //         return storyHelper.createStorySeq(client, testPartyId,
      //           [TEST_PAGE_1_TEXT, TEST_PAGE_2_TEXT],
      //           testParentId, moveAction);
      //       })
      //       .then(function(resStory) {
      //         newStory = resStory;
      //       });
      //   });

      //   it("should create an action", function() {
      //     var actionQuery = tables.move_actions.select().where(
      //       tables.move_actions.story_id.equals(newStory.id)).toQuery();
      //     return client.queryAsync(actionQuery.text, actionQuery.values)
      //       .then(function(res) {
      //         assert.equal(res.rows.length, 1);
      //         assert.equal(res.rows[0].from_waypoint_id, testwaypoint1.id);
      //         assert.equal(res.rows[0].to_waypoint_id, testwaypoint2.id);
      //       });
      //   });
      // });
    });
  });
};
