var BPromise = require('bluebird');
var chai = require('chai'),
  assert = chai.assert;

var tables = require('../../../bin/tables');
var Errors = require('../../../server/errors');

var decisionTreeSql = require('../../../server/sql/decision-tree');
var decisionTreeHelper = require('../../../server/helpers/decision-tree');

module.exports = function(client, sandbox) {

  describe("#fetchTree", function() {

    var testTree;
    beforeEach(function() {

      return client.queryAsync('SET CONSTRAINTS has_root_node DEFERRED')
        .then(function() {
          return decisionTreeSql.insertTreeWithRootNode(client);
        })
        .then(function(resTree) {
          testTree = resTree;
        });
    });
    
    describe("with single node and outcome", function() {

      var TEST_OUTCOME_TYPE = 'testoutcome';
      var TEST_OUTCOME_ARGS = ['outcomearg'];

      var testNodeId;
      beforeEach(function() {
        return decisionTreeSql.insertOutcomeType(client, TEST_OUTCOME_TYPE)
          .then(function() {
            return decisionTreeSql.insertOutcome(client, testTree.root_node_id,
              TEST_OUTCOME_TYPE, TEST_OUTCOME_ARGS, 0);
          });
      });

      it("should fetch one node with outcome", function() {
        return decisionTreeHelper.fetchTree(client, testTree.id)
          .then(function(node) {
            assert.equal(node.getOutcomes()[0].getType(), TEST_OUTCOME_TYPE);
            assert.deepEqual(node.getOutcomes()[0].getArgs(),
              TEST_OUTCOME_ARGS);
          });
      });
      
    });
    
    describe("with if/else nodes and outcomes", function() {

      var TEST_OUTCOME_1_TYPE = 'testoutcome1';
      var TEST_OUTCOME_1_ARGS = ['outcomearg1'];
      var TEST_OUTCOME_2_TYPE = 'testoutcome2';
      var TEST_OUTCOME_2_ARGS = ['outcomearg2'];
      var TEST_CONDITION_TYPE = "testcondition";
      var TEST_CONDITION_ARGS = ['conditionarg'];

      var testLeafNode1Id;
      var testLeafNode2Id;
      beforeEach(function() {

        return decisionTreeSql.insertOutcomeType(client, TEST_OUTCOME_1_TYPE)
          .then(function() {
            return decisionTreeSql.insertOutcomeType(
              client, TEST_OUTCOME_2_TYPE);
          })
          .then(function() {
            return decisionTreeSql.insertConditionType(
              client, TEST_CONDITION_TYPE);
          })

          // create leaf nodes
          .then(function() {
            return decisionTreeSql.insertNode(client, testTree.id);
          })
          .then(function(resNode) {
            testLeafNode1Id = resNode.id;
            return decisionTreeSql.insertNode(client, testTree.id);
          })
          .then(function(resNode) {
            testLeafNode2Id = resNode.id;
            // add an edge
            return decisionTreeSql.insertEdge(client, testTree.root_node_id,
              TEST_CONDITION_TYPE, TEST_CONDITION_ARGS,
              testLeafNode1Id, testLeafNode2Id);
          })

          // add outcomes
          .then(function() {
            return decisionTreeSql.insertOutcome(client, testLeafNode1Id,
              TEST_OUTCOME_1_TYPE, TEST_OUTCOME_1_ARGS, 0);
          })
          .then(function() {
            return decisionTreeSql.insertOutcome(client, testLeafNode2Id,
              TEST_OUTCOME_2_TYPE, TEST_OUTCOME_2_ARGS, 0);
          })
      });

      it("should fetch three nodes, one edge and two outcomes", function() {
        return decisionTreeHelper.fetchTree(client, testTree.id)
          .then(function(node) {

            assert.equal(node.getEdge().getFromNode(), node);
            assert.equal(node.getEdge().getConditionType(),
              TEST_CONDITION_TYPE);
            assert.deepEqual(node.getEdge().getConditionArgs(),
              TEST_CONDITION_ARGS);

            var ifNode = node.getEdge().getIfNode();
            assert.equal(ifNode.getOutcomes()[0].getType(),
              TEST_OUTCOME_1_TYPE);
            assert.deepEqual(ifNode.getOutcomes()[0].getArgs(),
              TEST_OUTCOME_1_ARGS);
            
            var elseNode = node.getEdge().getElseNode();
            assert.equal(elseNode.getOutcomes()[0].getType(),
              TEST_OUTCOME_2_TYPE);
            assert.deepEqual(elseNode.getOutcomes()[0].getArgs(),
              TEST_OUTCOME_2_ARGS);
          });
      });
      
    });

  });

};