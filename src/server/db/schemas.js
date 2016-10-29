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
    }),

    // A public identity that a user can take on in-game.
    // Users can have multiple characters that they can switch between.
    // Each character maintains a separate appearance, world location, battle stats, etc.
    characters: sql.define({
        name: 'characters',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'user_id', dataType: 'int', notNull: true },
            { name: 'name', dataType: 'text', notNull: true }
        ], foreignKeys: [
            { columns: ['user_id'], table: 'users', refColumns: ['id'] }
        ]
    })
};