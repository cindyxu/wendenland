var tables = require('../../bin/tables');
var userTable = tables.users;

var userSql = {};

userSql.insertUser = function(db, username, passwordHash) {
    var query = userTable.insert(
            userTable.username.value(username),
            userTable.password_hash.value(passwordHash)
        ).returning().toQuery();
    return db.queryAsync(query.text, query.values)
        .then(function(res) {
            return res.rows[0];
        });
};

userSql.findUserByUsername = function(db, username) {
    var query = userTable.select()
            .where(userTable.username.equals(username)).toQuery();
    return db.queryAsync(query.text, query.values)
        .then(function(res) {
            return res.rows[0];
        });
};

module.exports = userSql;