DROP TABLE IF EXISTS move_actions;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS characters;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS inhabitants;
DROP TABLE IF EXISTS species;

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
    stat_luk integer NOT NULL DEFAULT 0,
    FOREIGN KEY(species_id) REFERENCES species(id)
);

CREATE TABLE parties(
    id serial PRIMARY KEY
);

CREATE TABLE users(
    id serial PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password_hash text
);

CREATE TABLE characters(
    id serial PRIMARY KEY,
    user_id integer NOT NULL,
    inhabitant_id integer NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(inhabitant_id) REFERENCES inhabitants(id)
);

CREATE TABLE stories(
    id serial PRIMARY KEY,
    action_type text,
    party_id integer NOT NULL,
    parent_id integer,
    FOREIGN KEY(parent_id) REFERENCES stories(id),
    FOREIGN KEY(party_id) REFERENCES parties(id)
);

CREATE TABLE pages(
    id serial PRIMARY KEY,
    story_id integer NOT NULL,
    idx integer NOT NULL,
    content text NOT NULL,
    FOREIGN KEY(story_id) REFERENCES stories(id)
);

CREATE TABLE move_actions(
    id serial PRIMARY KEY,
    story_id integer NOT NULL,
    dir text NOT NULL,
    FOREIGN KEY(story_id) REFERENCES stories(id)
);