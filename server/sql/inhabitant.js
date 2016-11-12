var tables = require('../../bin/tables');
var inhabitantTable = tables.inhabitants;

var inhabitantSql = {};

inhabitantSql.insertInhabitantOfSpecies = function(
    db, name, species, partyId) {
    return inhabitantSql.insertInhabitant(
        db, name, species.id, partyId,
        species.stat_int, species.stat_dex,
        species.stat_agi, species.stat_vit);
};

inhabitantSql.insertInhabitant = function(
    db, name, speciesId, partyId, int, dex, agi, vit) {

    var query = inhabitantTable.insert(
            inhabitantTable.name.value(name),
            inhabitantTable.species_id.value(speciesId),
            inhabitantTable.party_id.value(partyId),
            inhabitantTable.stat_int.value(int),
            inhabitantTable.stat_dex.value(dex),
            inhabitantTable.stat_agi.value(agi),
            inhabitantTable.stat_vit.value(vit)
        ).returning().toQuery();
    return db.queryAsync(query.text, query.values)
        .then(function(res) {
            return res.rows[0];
        });
};

module.exports = inhabitantSql;