var BPromise = require('bluebird');
var _ = require('lodash');

var Errors = require('../errors');

var itemSql = require('../sql/item');

var itemHelper = {};

itemHelper.changeItemsOwner = function(db, ids, inhabitantId) {
    return itemSql.setItemsInhabitantId(db, ids, inhabitantId);
};

module.exports = itemHelper;