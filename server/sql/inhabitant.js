module.exports = function(tables) {

    var inhabitantTable = tables.inhabitants;

    var inhabitantSql = {};

    inhabitantSql.insertInhabitantOfSpecies = function(
        name, partyId, species, db) {
        return inhabitantSql.insertInhabitant(
            name, species.id, partyId,
            species.stat_str, species.stat_dex,
            species.stat_int, species.stat_luk, db);
    };

    inhabitantSql.insertInhabitant = function(
        name, speciesId, partyId, str, dex, int, luk, db) {

        var query = inhabitantTable.insert(
                inhabitantTable.name.value(name),
                inhabitantTable.species_id.value(speciesId),
                inhabitantTable.party_id.value(partyId),
                inhabitantTable.stat_str.value(str),
                inhabitantTable.stat_dex.value(dex),
                inhabitantTable.stat_int.value(int),
                inhabitantTable.stat_luk.value(luk)
            ).returning().toQuery();
        return db.queryAsync(query.text, query.values)
            .then(function(res) {
                return res.rows[0];
            });
    };

    return inhabitantSql;

};