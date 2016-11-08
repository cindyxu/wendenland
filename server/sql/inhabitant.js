module.exports = function(tables) {

    var inhabitantTable = tables.inhabitants;

    var inhabitantSql = {};

    inhabitantSql.insertInhabitantOfSpecies = function(
        db, name, species, partyId) {
        return inhabitantSql.insertInhabitant(
            db, name, species.id, partyId,
            species.stat_str, species.stat_dex,
            species.stat_int, species.stat_luk);
    };

    inhabitantSql.insertInhabitant = function(
        db, name, speciesId, partyId, str, dex, int, luk) {

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