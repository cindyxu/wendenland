var schemas = require("../db/schemas");
var moveActionSchema = schemas.move_actions;

var moveActionSql = {};

moveActionSql.insertRow = function(storyId, dir) {
    // var query = moveActionSchema.insert(
    //         moveActionSchema.storyId.value(storyId),
    //         moveActionSchema.dir.value(dir)
    //     ).toQuery();
    // return db.runAsync(query.text, query.values)
    //     .then(function() { return this.lastID; });
    throw "Not implemented!";
};

module.exports = moveActionSql;