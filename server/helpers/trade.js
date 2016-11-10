var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

var tradeSql = require('../sql/trade');
var itemHelper = require('./item');
var TradeStatusTypes = require('../trade-status-types');

var tradeHelper = {};

tradeHelper.requestTrade = function(db, fromInhabitantId, toInhabitantId) {
  return tradeSql.insertTrade(db, fromInhabitantId, toInhabitantId);
};

tradeHelper.acceptTrade = function(db, tradeId) {
  return tradeSql.setTradeInhabitantStatus(
    db, tradeId, tradeSql.TO /* side */, TradeStatusTypes.OPEN);
};

tradeHelper.addItemToTrade = function(db, tradeId, inhabitantId, itemId) {
  return tradeSql.insertTradeItemOffer(db, tradeId, inhabitantId, itemId);
};

tradeHelper.proposeTrade = function(db, tradeId, side) {
  return tradeSql.setTradeInhabitantStatus(
      db, tradeId, side, TradeStatusTypes.PROPOSED);
};

tradeHelper.confirmTradeSeq = function(tr, tradeId, side) {
  return tradeSql.setTradeInhabitantStatus(
      tr, tradeId, side, TradeStatusTypes.CONFIRMED, true)
    .then(function(resTrade) {
      if (resTrade.from_status === TradeStatusTypes.CONFIRMED
        && resTrade.to_status === TradeStatusTypes.CONFIRMED) {
        return tradeHelper._performTradeSeq(tr, resTrade);
      }
    });
};

tradeHelper._performTradeSeq = function(tr, trade) {
  return tradeSql.setTradedItemsInhabitantId(tr, trade, tradeSql.FROM)
  .then(function() {
    return tradeSql.setTradedItemsInhabitantId(tr, trade, tradeSql.TO);
  });
}

tradeHelper.cancelTrade = function(db, tradeId, side) {
  return tradeSql.setTradeInhabitantStatus(
      db, tradeId, side, TradeStatusTypes.CANCELLED);
};

module.exports = tradeHelper;