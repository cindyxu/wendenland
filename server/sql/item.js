var tables = require('../../bin/tables');
var itemBlueprintTable = tables.item_blueprints;
var itemTable = tables.items;

var itemSql = {};

itemSql.findItemById = function(db, itemId) {
  var query = itemTable.select().where(itemTable.id.equals(itemId))
    .toQuery();
  return db.queryAsync(query.text, query.values)
    .then(function(res) {
      return res.rows[0];
    });
};

itemSql.insertItemBlueprint = function(db, name) {
    var query = itemBlueprintTable.insert(
            itemBlueprintTable.name.value(name)
        ).returning().toQuery();
    return db.queryAsync(query.text, query.values)
        .then(function(res) {
            return res.rows[0];
        });
};

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

module.exports = itemSql;