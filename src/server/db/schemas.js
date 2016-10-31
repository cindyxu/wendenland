var sql = require('sql');
sql.setDialect('sqlite');

module.exports = {

    species: sql.define({
        name: 'species',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'name', dataType: 'text', notNull: true },

            // Base stats for the species.
            { name: 'stat_str', dataType: 'int', notNull: true, default: 0 },
            { name: 'stat_dex', dataType: 'int', notNull: true, default: 0 },
            { name: 'stat_int', dataType: 'int', notNull: true, default: 0 },
            { name: 'stat_luk', dataType: 'int', notNull: true, default: 0 }
        ]
    }),

    // Any living being that inhabits the game world - character, npc, monster, etc.
    inhabitants: sql.define({
        name: 'inhabitants',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'name', dataType: 'text', notNull: true },
            { name: 'species_id', dataType: 'int', notNull: true },

            // Every inhabitant starts with the base stats for their species,
            // but if they level up, these stats can go up as well.
            { name: 'stat_str', dataType: 'int', notNull: true },
            { name: 'stat_dex', dataType: 'int', notNull: true },
            { name: 'stat_int', dataType: 'int', notNull: true },
            { name: 'stat_luk', dataType: 'int', notNull: true }

        ], foreignKeys: [
            { columns: ['species_id'], table: 'species', refColumns: ['id'] }
        ]
    }),

    // Authentication info for a player.
    // This is not necessarily public - it is just for login purposes.
    users : sql.define({
        name: 'users',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'username', dataType: 'text', notNull: true, unique: true },
            { name: 'password_hash', dataType: 'text' }
        ]
    }),

    // A public identity that a user can take on in-game. Basically a users-inhabitants table.
    // For now, every character is of species "traveller".
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

    /**
     * A collection of ordered pages + possible actions to take.
     * Conceptually looks something like this:
     * 
     * pages: "You push the door. It creaks open." => "It's dark inside."
     * actions: "look around" | "go north"
     *
     * Taking an action will generate another story.
     */
    stories: sql.define({
        name: 'stories',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'parent_id', dataType: 'int' },
            // refers to the type of action taken to get to this story.
            // eg. "move", "talk", "skill", etc.
            { name: 'action_type', dataType: 'text' }
        ], foreignKeys: [
            { table: 'story', columns: ['parent_id'], refColumns: ['id'] }
        ]
    }),

    // One page of a story.
    pages: sql.define({
        name: 'pages',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'story_id', dataType: 'int', notNull: true },
            { name: 'index', dataType: 'int', notNull: true },
            { name: 'text', dataType: 'text', notNull: true }
        ], foreignKeys: [
            { table: 'story', columns: ['story_id'], refColumns: ['id'] }
        ]
    }),

    move_actions: sql.define({
        name: 'move_actions',
        columns: [
            { name: 'id', dataType: 'int', primaryKey: true, autoIncrement: true },
            { name: 'story_id', dataType: 'int', notNull: true },
            { name: 'dir', dataType: 'text', notNull: true }
        ], foreignKeys: [
            { table: 'stories', columns: ['story_id'], refColumns: ['id'] }
        ]
    }),
};