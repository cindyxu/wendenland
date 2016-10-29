module.exports = {
    prepare: function(queryObj, db) {
        var queryText = queryObj.toQuery().text;
        return db.prepareAsync(queryText);
    }
};