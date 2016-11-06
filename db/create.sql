--delete all tables

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public IS 'standard public schema';

--create enums
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'direction') THEN
        CREATE TYPE direction AS ENUM (
            'north',
            'south',
            'east',
            'west',
            'northwest',
            'southwest',
            'northeast',
            'southeast',
            'down',
            'up'
        );
    END IF;
    --more types here...
END$$;

--create all tables

CREATE TABLE species(
    id serial PRIMARY KEY,
    name text NOT NULL,
    stat_str integer NOT NULL DEFAULT 0,
    stat_dex integer NOT NULL DEFAULT 0,
    stat_int integer NOT NULL DEFAULT 0,
    stat_luk integer NOT NULL DEFAULT 0
);

CREATE TABLE inhabitants(
    id serial PRIMARY KEY,
    name text NOT NULL,
    species_id integer NOT NULL,
    party_id integer NOT NULL,
    stat_str integer NOT NULL DEFAULT 0,
    stat_dex integer NOT NULL DEFAULT 0,
    stat_int integer NOT NULL DEFAULT 0,
    stat_luk integer NOT NULL DEFAULT 0
);

CREATE TABLE parties(
    id serial PRIMARY KEY,
    story_id integer
);

CREATE TABLE users(
    id serial PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password_hash text
);

CREATE TABLE characters(
    id serial PRIMARY KEY,
    user_id integer NOT NULL,
    inhabitant_id integer NOT NULL
);

CREATE TABLE maps(
    id serial PRIMARY KEY,
    name text NOT NULL,
    x integer NOT NULL,
    y integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL
);

CREATE TABLE waypoints(
    id serial PRIMARY KEY,
    name text NOT NULL,
    map_id integer NOT NULL,
    x integer NOT NULL,
    y integer NOT NULL
);

CREATE TABLE paths(
    from_waypoint_id integer NOT NULL,
    to_waypoint_id integer NOT NULL,
    dir direction NOT NULL,
    UNIQUE(from_waypoint_id, dir),
    PRIMARY KEY(from_waypoint_id, to_waypoint_id)
);

CREATE TABLE stories(
    id serial PRIMARY KEY,
    action_type text,
    party_id integer NOT NULL,
    parent_id integer,
    waypoint_id integer
);

CREATE TABLE pages(
    story_id integer NOT NULL,
    idx integer NOT NULL,
    content text NOT NULL,
    PRIMARY KEY(story_id, idx)
);

CREATE TABLE move_actions(
    id serial PRIMARY KEY,
    from_waypoint_id integer NOT NULL,
    to_waypoint_id integer NOT NULL,
    story_id integer NOT NULL,
    is_success boolean NOT NULL
);

CREATE TABLE chirp_actions(
    id serial PRIMARY KEY,
    story_id integer NOT NULL
);

--add foreign keys afterward now that all tables exist

ALTER TABLE inhabitants
ADD FOREIGN KEY(species_id) REFERENCES species(id);

ALTER TABLE parties
ADD FOREIGN KEY(story_id) REFERENCES stories(id);

ALTER TABLE characters
ADD FOREIGN KEY(user_id) REFERENCES users(id),
ADD FOREIGN KEY(inhabitant_id) REFERENCES inhabitants(id);

ALTER TABLE waypoints
ADD FOREIGN KEY(map_id) REFERENCES maps(id);

ALTER TABLE paths
ADD FOREIGN KEY(from_waypoint_id) REFERENCES waypoints(id),
ADD FOREIGN KEY(to_waypoint_id) REFERENCES waypoints(id);

ALTER TABLE stories
ADD FOREIGN KEY(parent_id) REFERENCES stories(id),
ADD FOREIGN KEY(party_id) REFERENCES parties(id),
ADD FOREIGN KEY(waypoint_id) REFERENCES waypoints(id);

ALTER TABLE pages
ADD FOREIGN KEY(story_id) REFERENCES stories(id);

ALTER TABLE move_actions
ADD FOREIGN KEY(story_id) REFERENCES stories(id),
ADD FOREIGN KEY(from_waypoint_id, to_waypoint_id) REFERENCES paths(from_waypoint_id, to_waypoint_id);

ALTER TABLE chirp_actions
ADD FOREIGN KEY(story_id) REFERENCES stories(id);