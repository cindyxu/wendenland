var tables = require('../../bin/tables');
var itemTable = tables.items;

var itemSql = {};

itemSql.insertItem = function(db, blueprintId, inhabitantId) {
    var query = itemTable.insert(
            itemTable.blueprint_id.value(blueprintId),
            itemTable.inhabitant_id.value(inhabitantId)
        ).returning().toQuery();
    return db.queryAsync(query.text, query.values)
        .then(function(res) {
            return res.rows[0];
        });
};

// assign owner of items
itemSql.setItemsInhabitantId = function(db, itemIds, inhabitantId) {
    var updateObj = {};
    updateObj[itemTable.inhabitant_id.name] = inhabitantId;
    var query = itemTable.update(updateObj)
     .where(itemTable.id.in(itemIds)).toQuery();
    return db.queryAsync(query.text, query.values)
      .then(function(res) {
        return;
      });
};

module.exports = itemSql;