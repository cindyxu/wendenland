var sql = require('sql');
sql.setDialect('sqlite');

module.exports = {

    // Authentication info for a player.
    // This is not necessarily public - it is just for login purposes.
    users : sql.define({
        name: 'users',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'username', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'password_hash', dataType: 'text', notNull: true, unique: true }
        ]
    })
};