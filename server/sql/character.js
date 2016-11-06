var tables = require('../../bin/tables');
var characterTable = tables.characters;

var characterSql = {};

characterSql.insertCharacter = function(db, userId, inhabitantId) {
    var query = characterTable.insert(
            characterTable.user_id.value(userId),
            characterTable.inhabitant_id.value(inhabitantId)
            ).returning().toQuery();
    return db.queryAsync(query.text, query.values)
    	.then(function(res) {
            return res.rows[0];
        });
};

module.exports = characterSql;