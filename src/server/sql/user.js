var schemas = require("../db/schemas");
var userSchema = schemas.users;

var userSql = {};

userSql.insertRow = function(username, passwordHash, db) {
    // var query = userSchema.insert(
    //         userSchema.username.value(username),
    //         userSchema.password_hash.value(passwordHash)
    //     ).toQuery();
    // return db.runAsync(query.text, query.values)
    //     .then(function() { return this.lastID; });
    throw "Not implemented!";
};

userSql.findByUsername = function(username, db) {
    // var query = userSchema.select()
    //         .where(userSchema.username.equals(username)).toQuery();
    // return db.getAsync(query.text, query.values);
    throw "Not implemented!";
};

module.exports = userSql;