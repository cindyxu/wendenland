var assert = require('assert');

var tables = require('../../bin/tables');
var itemTable = tables.items;
var tradeTable = tables.trades;
var tradeItemOfferTable = tables.trade_item_offers;

var StatusTypes = require('../trade-status-types');

var tradeSql = {};

tradeSql.FROM = 1;
tradeSql.TO = 2;

tradeSql.findTradeById = function(db, tradeId) {
  assert(db); assert(tradeId);
  var query = tradeTable.select().where(tradeTable.id.equals(tradeId))
    .toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return res.rows[0];
    });
};

tradeSql.insertTrade = function(db, fromInhabitantId, toInhabitantId) {
  assert(db); assert(fromInhabitantId); assert(toInhabitantId);
  var query = tradeTable.insert(
    tradeTable.from_inhabitant_id.value(fromInhabitantId),
    tradeTable.to_inhabitant_id.value(toInhabitantId),
    tradeTable.from_status.value(StatusTypes.OPEN),
    tradeTable.to_status.value(StatusTypes.NO_ACTION)
  ).returning().toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return res.rows[0];
    });
};

tradeSql.setTradeInhabitantStatus = function(
  db, tradeId, side, status, opt_returning) {
  assert(db); assert(tradeId); assert(side); assert(status);
  var updateObj = {};
  if (side === tradeSql.FROM) {
    updateObj[tradeTable.from_status.name] = status;
  } else if (side === tradeSql.TO) {
    updateObj[tradeTable.to_status.name] = status;
  } else {
    throw "Not a valid side!";
  }
  var query = tradeTable.update(updateObj)
   .where(tradeTable.id.equals(tradeId));
  if (opt_returning) query = query.returning();
  query = query.toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return res.rows[0];
    });
};

tradeSql.insertTradeItemOffer = function(db, tradeId, inhabitantId, itemId) {
  assert(db); assert(tradeId); assert(inhabitantId); assert(itemId);
  var query = tradeItemOfferTable.insert(
    tradeItemOfferTable.trade_id.value(tradeId),
    tradeItemOfferTable.inhabitant_id.value(inhabitantId),
    tradeItemOfferTable.item_id.value(itemId)
  ).returning().toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return res.rows[0]; });
};

tradeSql.deleteTradeItemOffer = function(db, tradeId, inhabitantId, itemId) {
  assert(db); assert(tradeId); assert(inhabitantId); assert(itemId);
  var query = tradeItemOfferTable.delete().where(
    tradeItemOfferTable.trade_id.equals(tradeId)).and(
    tradeItemOfferTable.inhabitant_id.equals(inhabitantId)).and(
    tradeItemOfferTable.item_id.equals(itemId)
  ).toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) { return; });
};

tradeSql.getTradeItemOffers = function(db, tradeId, inhabitantId) {
  assert(db); assert(tradeId); assert(inhabitantId);
  var query = tradeItemOfferTable.select().where(
    tradeItemOfferTable.trade_id.equals(tradeId)).and(
    tradeItemOfferTable.inhabitant_id.equals(inhabitantId)
  ).toQuery();
  return db.queryAsync(query.text, query.values).then(function(res) {
    return res.rows;
  });
};

tradeSql.setTradedItemsInhabitantId = function(db, trade, side) {
  assert(db); assert(trade); assert(side);

  var updateObj = {};
  updateObj[itemTable.inhabitant_id.name] = side === tradeSql.FROM ?
    trade.to_inhabitant_id : trade.from_inhabitant_id;

  var targetInhabitantId = side === tradeSql.FROM ?
      trade.from_inhabitant_id : trade.to_inhabitant_id;
  
  var query = itemTable.update(updateObj).from(tradeItemOfferTable).where(
    tradeItemOfferTable.trade_id.equals(trade.id)).and(
    tradeItemOfferTable.inhabitant_id.equals(targetInhabitantId)).and(
    itemTable.id.equals(tradeItemOfferTable.item_id))
    .toQuery();
  
  return db.queryAsync(query.text, query.values).then(function(res) {
    return;
  });
}

module.exports = tradeSql;