var _ = require('lodash');
var BPromise = require('bluebird');
var assert = require('assert');

var decisionTreeHelper = {};
var decisionTreeSql = require('../sql/decision-tree');

decisionTreeHelper.fetchTree = function(client, treeId) {
  var tree;
  var nodes;
  var edges;
  var outcomes;

  var nodeIds;

  return decisionTreeSql.findTreeById(client, treeId)
    .then(function(resTree) {
      tree = resTree;
      return decisionTreeSql.findNodesByTreeId(client, treeId);
    })
    .then(function(resNodes) {
      nodes = resNodes;
      nodeIds = _.map(nodes, function(node) { return node.id; });
      return decisionTreeSql.findEdgesByFromNodeIds(client, nodeIds);
    })
    .then(function(resEdges) {
      edges = resEdges;
      return decisionTreeSql.findOutcomesByNodeIds(client, nodeIds);
    })
    .then(function(resOutcomes) {
      outcomes = resOutcomes;
      return decisionTreeHelper._formatTree(
        tree, nodes, edges, outcomes);
    });
};

decisionTreeHelper._formatTree =
  function(tree, nodes, edges, outcomes) {

    var nodeIdMap = _.transform(nodes, function(res, node) {
      res[node.id] = new _DecisionNode();
    }, {});
    var visitedMap = {};
    var nodeIdQueue = [tree.root_node_id];

    while (nodeIdQueue.length > 0) {
      var nodeId = nodeIdQueue.shift();
      var node = nodeIdMap[nodeId];

      if (visitedMap[nodeId]) continue;
      else visitedMap[nodeId] = node;

      // add edge
      var edgesProps = _.remove(edges,
        function(edge) { return edge.from_node_id === nodeId; });
      if (!_.isEmpty(edgesProps)) {
        var edgeProps = edgesProps[0];
        node.setEdge(new _DecisionEdge(
          edgeProps.condition_type, edgeProps.condition_args, node,
          nodeIdMap[edgeProps.if_node_id], nodeIdMap[edgeProps.else_node_id]
        ));
        nodeIdQueue.push(edgeProps.if_node_id);
        nodeIdQueue.push(edgeProps.else_node_id);
      }

      // add outcomes
      var nodeOutcomeProps = _.remove(outcomes, function(outcome) {
        return outcome.node_id === nodeId;
      });
      for (var i = 0; i < nodeOutcomeProps.length; i++) {
        var outcome = nodeOutcomeProps[i];
        node.addOutcome(new _DecisionOutcome(outcome.type, outcome.args));
      }
    }

    return nodeIdMap[tree.root_node_id];
};

var _DecisionNode = function() {
  this._edge = undefined;
  this._outcomes = [];
};

_DecisionNode.prototype.setEdge = function(edge) {
  this._edge = edge;
};

_DecisionNode.prototype.addOutcome = function(outcome) {
  this._outcomes.push(outcome);
};

_DecisionNode.prototype.getEdge = function() { return this._edge; };

_DecisionNode.prototype.getOutcomes = function() { return this._outcomes; };

var _DecisionEdge = function(
  conditionType, conditionArgs, fromNode, ifNode, elseNode) {
  this._conditionType = conditionType;
  this._conditionArgs = conditionArgs;
  this._fromNode = fromNode;
  this._ifNode = ifNode;
  this._elseNode = elseNode;
};

_DecisionEdge.prototype.getConditionType = function() {
  return this._conditionType; };

_DecisionEdge.prototype.getConditionArgs = function() {
  return this._conditionArgs; };

_DecisionEdge.prototype.getFromNode = function() { return this._fromNode; };

_DecisionEdge.prototype.getIfNode = function() { return this._ifNode; };

_DecisionEdge.prototype.getElseNode = function() { return this._elseNode; };

var _DecisionOutcome = function(type, Args) {
  this._type = type;
  this._args = Args;
};

_DecisionOutcome.prototype.getType = function() { return this._type; };

_DecisionOutcome.prototype.getArgs = function() { return this._args; };

module.exports = decisionTreeHelper;