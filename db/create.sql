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

CREATE TYPE trade_status AS ENUM (
  'no_action',
  'open',
  'proposed',
  'confirmed',
  'cancelled'
);

-- create all tables

CREATE TABLE species(
  id serial PRIMARY KEY,
  name text NOT NULL,
  stat_int integer NOT NULL DEFAULT 0,
  stat_dex integer NOT NULL DEFAULT 0,
  stat_agi integer NOT NULL DEFAULT 0,
  stat_vit integer NOT NULL DEFAULT 0
);

CREATE TABLE item_blueprints(
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text
);

CREATE TABLE items(
  id serial PRIMARY KEY,
  blueprint_id integer NOT NULL,
  inhabitant_id integer
);

CREATE TABLE inhabitants(
  id serial PRIMARY KEY,
  name text NOT NULL,
  species_id integer NOT NULL,
  party_id integer NOT NULL,
  stat_int integer NOT NULL DEFAULT 0,
  stat_dex integer NOT NULL DEFAULT 0,
  stat_agi integer NOT NULL DEFAULT 0,
  stat_vit integer NOT NULL DEFAULT 0
);

CREATE TABLE trades(
  id serial PRIMARY KEY,
  from_inhabitant_id integer NOT NULL,
  to_inhabitant_id integer NOT NULL,
  from_status trade_status NOT NULL DEFAULT 'open',
  to_status trade_status NOT NULL DEFAULT 'no_action'
);

CREATE TABLE trade_item_offers(
  trade_id integer NOT NULL,
  inhabitant_id integer NOT NULL,
  item_id integer NOT NULL,
  PRIMARY KEY(trade_id, inhabitant_id, item_id)
);

CREATE TABLE item_equips(
  inhabitant_id integer NOT NULL,
  item_id integer NOT NULL,
  PRIMARY KEY(inhabitant_id, item_id)
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
  action_args text[],
  party_id integer NOT NULL,
  parent_id integer,
  waypoint_id integer
);

CREATE TABLE pages(
  story_id integer NOT NULL,
  idx smallint NOT NULL,
  content text NOT NULL,
  PRIMARY KEY(story_id, idx)
);

CREATE TABLE action_types(
  type text PRIMARY KEY
);

--add foreign keys afterward now that all tables exist

ALTER TABLE items
ADD FOREIGN KEY(blueprint_id) REFERENCES item_blueprints(id),
ADD FOREIGN KEY(inhabitant_id) REFERENCES inhabitants(id);

ALTER TABLE item_equips
ADD FOREIGN KEY(inhabitant_id) REFERENCES inhabitants(id),
ADD FOREIGN KEY(item_id) REFERENCES items(id);

ALTER TABLE trades
ADD FOREIGN KEY(from_inhabitant_id) REFERENCES inhabitants(id),
ADD FOREIGN KEY(to_inhabitant_id) REFERENCES inhabitants(id);

ALTER TABLE trade_item_offers
ADD FOREIGN KEY(trade_id) REFERENCES trades(id),
ADD FOREIGN KEY(inhabitant_id) REFERENCES inhabitants(id),
ADD FOREIGN KEY(item_id) REFERENCES items(id);

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
ADD FOREIGN KEY(waypoint_id) REFERENCES waypoints(id),
ADD FOREIGN KEY(action_type) REFERENCES action_types(type);

ALTER TABLE pages
ADD FOREIGN KEY(story_id) REFERENCES stories(id);

ALTER TABLE actions
ADD FOREIGN KEY(story_id) REFERENCES stories(id);
ADD FOREIGN KEY(action_type) REFERENCES action_types(type);

-- triggers

CREATE OR REPLACE function verify_can_change_trade_status()
RETURNS trigger AS $function$
BEGIN

  -- ensure that if trade has already been confirmed by both characters,
  -- it cannot be changed anymore.
  IF OLD.from_status = 'confirmed' AND OLD.to_status = 'confirmed' THEN
    RAISE EXCEPTION 'Cannot change a finished trade.';
  END IF;

  -- ensure that if trade has been cancelled,
  -- it cannot be changed anymore.
  IF OLD.from_status = 'cancelled' OR OLD.to_status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot change a cancelled trade.';
  END IF;

  -- ensure that if one party hasn't proposed yet,
  -- neither party can confirm.
  IF OLD.from_status = 'open' OR OLD.to_status = 'open' THEN
    IF NEW.from_status = 'confirmed' OR NEW.to_status = 'confirmed' THEN
      RAISE EXCEPTION 'Cannot confirm an open trade.';
    END IF;
  END IF;

  RETURN NEW;
  END;
  $function$ LANGUAGE plpgsql;

  CREATE TRIGGER trades_changes
  BEFORE UPDATE ON trades
  FOR EACH ROW
  EXECUTE PROCEDURE verify_can_change_trade_status();

-- ensure that if trade has not been accepted or has already been confirmed,
-- trade_item_offers for trade cannot be changed.

CREATE OR REPLACE function verify_can_change_item_offer()
RETURNS trigger AS $function$
BEGIN
  DECLARE offer RECORD;
  DECLARE trade RECORD;
  BEGIN
    offer := COALESCE(NEW, OLD);
    SELECT * INTO trade FROM trades WHERE id = offer.trade_id;
    IF ((trade.from_inhabitant_id = offer.inhabitant_id AND (
      trade.from_status IN ('proposed', 'confirmed'))) OR
    (trade.to_inhabitant_id = offer.inhabitant_id AND (
      trade.to_status IN ('proposed', 'confirmed')))) THEN
      RAISE EXCEPTION 'Cannot change a proposed trade.';
    END IF;
    IF (trade.from_status = 'no_action' OR trade.to_status = 'no_action') THEN
      RAISE EXCEPTION 'Cannot change a trade that is not open yet.';
    END IF;
    IF (trade.from_status = 'cancelled' OR trade.to_status = 'cancelled') THEN
      RAISE EXCEPTION 'Cannot change a cancelled trade.';
    END IF;
    RETURN offer;
  END;
END;
$function$ LANGUAGE plpgsql;

CREATE TRIGGER trade_item_offers_changes
BEFORE INSERT OR UPDATE OR DELETE ON trade_item_offers
FOR EACH ROW
EXECUTE PROCEDURE verify_can_change_item_offer();