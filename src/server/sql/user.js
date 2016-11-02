module.exports = function(tables) {

    var userTable = tables.users;

    var userSql = {};

    userSql.insertUser = function(username, passwordHash, db) {
        // var query = userTable.insert(
        //         userTable.username.value(username),
        //         userTable.password_hash.value(passwordHash)
        //     ).toQuery();
        // return db.runAsync(query.text, query.values)
        //     .then(function() { return this.lastID; });
        throw "Not implemented!";
    };

    userSql.findUserByUsername = function(username, db) {
        // var query = userTable.select()
        //         .where(userTable.username.equals(username)).toQuery();
        // return db.getAsync(query.text, query.values);
        throw "Not implemented!";
    };

    return userSql;

};