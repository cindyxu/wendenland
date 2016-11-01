DROP TABLE IF EXISTS species;
CREATE TABLE species(
    id INT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    stat_str INT NOT NULL DEFAULT 0,
    stat_dex INT NOT NULL DEFAULT 0,
    stat_int INT NOT NULL DEFAULT 0,
    stat_luk INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS inhabitants;
CREATE TABLE inhabitants(
    id INT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    species_id INT NOT NULL,
    FOREIGN KEY(species_id) REFERENCES species(id)
);

DROP TABLE IF EXISTS parties;
CREATE TABLE parties(
    id INT PRIMARY KEY NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id INT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT
);

DROP TABLE IF EXISTS characters;
CREATE TABLE characters(
    id INT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    inhabitant_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(inhabitant_id) REFERENCES inhabitants(id)
);

DROP TABLE IF EXISTS stories;
CREATE TABLE stories(
    id INT PRIMARY KEY NOT NULL,
    action_type TEXT,
    party_id INT NOT NULL,
    parent_id INT,
    FOREIGN KEY(parent_id) REFERENCES stories(id),
    FOREIGN KEY(party_id) REFERENCES parties(id)
);

DROP TABLE IF EXISTS pages;
CREATE TABLE pages(
    id INT PRIMARY KEY NOT NULL,
    story_id TEXT NOT NULL,
    idx INT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY(story_id) REFERENCES stories(id)
);

DROP TABLE IF EXISTS move_actions;
CREATE TABLE move_actions(
    id INT PRIMARY KEY NOT NULL,
    story_id INT NOT NULL,
    dir TEXT NOT NULL,
    FOREIGN KEY(story_id) REFERENCES stories(id)
);