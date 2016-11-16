var assert = require('assert');

var tables = require('../../bin/tables');

var decisionTreeTable = tables.decision_trees;
var decisionNodeTable = tables.decision_nodes;
var decisionEdgeTable = tables.decision_edges;
var decisionOutcomeTable = tables.decision_outcomes;
var decisionConditionTypeTable = tables.decision_condition_types;
var decisionOutcomeTypeTable = tables.decision_outcome_types;

var decisionTreeSql = {};

decisionTreeSql.insertTreeWithRootNode = function(db) {
  var tree;
  
  var treeQuery = decisionTreeTable.insert(
    decisionTreeTable.root_node_id.value(-1)).returning(decisionTreeTable.id)
    .toQuery();

  return db.queryAsync(treeQuery.text, treeQuery.values)

    .then(function(res) {
      tree = res.rows[0];
      return decisionTreeSql.insertNode(db, tree.id);
    })

    .then(function(resNode) {
      return decisionTreeSql.setTreeRootNodeId(db, tree.id, resNode.id, true);
    });
};

decisionTreeSql.insertNode = function(db, treeId) {
  var nodeQuery = decisionNodeTable.insert(
    decisionNodeTable.tree_id.value(treeId))
    .returning().toQuery();
  return db.queryAsync(nodeQuery.text, nodeQuery.values)
  .then(function(res) {
    return res.rows[0];
  });
};

decisionTreeSql.insertEdge = function(
  db, fromNodeId, conditionType, conditionArgs, ifNodeId, elseNodeId) {
  
  var query = decisionEdgeTable.insert(
    decisionEdgeTable.from_node_id.value(fromNodeId),
    decisionEdgeTable.condition_type.value(conditionType),
    decisionEdgeTable.condition_args.value(conditionArgs),
    decisionEdgeTable.if_node_id.value(ifNodeId),
    decisionEdgeTable.else_node_id.value(elseNodeId))
    .returning().toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows[0]; });
};

decisionTreeSql.insertConditionType = function(db, type) {
  var query = decisionConditionTypeTable.insert(
    decisionConditionTypeTable.type.value(type)).returning().toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows[0]; })
};

decisionTreeSql.insertOutcomeType = function(db, type) {
  var query = decisionOutcomeTypeTable.insert(
    decisionOutcomeTypeTable.type.value(type)).returning().toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows[0]; })
};

decisionTreeSql.insertOutcome = function(db, nodeId, type, args, idx) {
  assert(db !== undefined); assert(nodeId !== undefined); 
  assert(type !== undefined); assert(args !== undefined);
  assert(idx !== undefined);

  console.log("outcome node id : " + nodeId);
  var query = decisionOutcomeTable.insert(
      decisionOutcomeTable.node_id.value(nodeId),
      decisionOutcomeTable.type.value(type),
      decisionOutcomeTable.args.value(args),
      decisionOutcomeTable.idx.value(idx)
    ).returning().toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows[0]; });
};

decisionTreeSql.setTreeRootNodeId = function(db, treeId, nodeId, returning) {
  var updateObj = {};
  updateObj[decisionTreeTable.root_node_id.name] = nodeId;
  var query = decisionTreeTable.update(updateObj)
   .where(decisionTreeTable.id.equals(treeId));
  if (returning) query = query.returning();
  query = query.toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return res.rows[0];
    });
};

decisionTreeSql.findTreeById = function(db, id) {
  var query = decisionTreeTable.select().where(decisionTreeTable.id.equals(id))
    .toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows[0]; });
};

decisionTreeSql.findNodesByTreeId = function(db, treeId) {
  var query = decisionNodeTable.select()
    .where(decisionNodeTable.tree_id.equals(treeId))
    .toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows; });
};

decisionTreeSql.findEdgesByFromNodeIds = function(db, nodeIds) {
  var query = decisionEdgeTable.select()
    .where(decisionEdgeTable.from_node_id.in(nodeIds))
    .toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows; });
};

decisionTreeSql.findOutcomesByNodeIds = function(db, nodeIds) {
  var query = decisionOutcomeTable.select()
    .where(decisionOutcomeTable.node_id.in(nodeIds))
    .toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows; });
};

module.exports = decisionTreeSql;