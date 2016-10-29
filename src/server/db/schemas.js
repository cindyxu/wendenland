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

    // A public identity that a user can take on in-game. Basically a users-inhabitants table.
    // Users can have multiple characters that they can switch between.
    characters: sql.define({
        name: 'characters',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'user_id', dataType: 'int', notNull: true }
        ], foreignKeys: [
            { columns: ['inhabitant_id'], table: 'users', refColumns: ['id'] },
            { columns: ['user_id'], table: 'users', refColumns: ['id'] }
        ]
    }),

    // Any living being that inhabits the game world - character, npc, monster, etc.
    inhabitants: sql.define({
        name: 'inhabitants',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'name', dataType: 'text', notNull: true },
            { name: 'species_id', dataType: 'int', notNull: true },
        ], foreignKeys: [
            { columns: ['species_id'], table: 'species', refColumns: ['id'] }
        ]
    }),

    species: sql.define({
        name: 'species',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'name', dataType: 'text', notNull: true }
        ]
    })
};