module.exports = function(tables) {

    var inhabitantTable = tables.inhabitants;

    var inhabitantSql = {};

    inhabitantSql.insertInhabitant = function(
        name, speciesId, partyId, str, dex, int, luk, db) {
        // var query = inhabitantTable.insert(
        //         inhabitantTable.name.value(name),
        //         inhabitantTable.species_id.value(speciesId),
        //         inhabitantTable.stat_str.value(str),
        //         inhabitantTable.stat_dex.value(dex),
        //         inhabitantTable.stat_int.value(int),
        //         inhabitantTable.stat_luk.value(luk)
        //     ).toQuery();
        // return db.runAsync(query.text, query.values)
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    return inhabitantSql;

};