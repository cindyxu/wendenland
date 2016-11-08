module.exports = function(tables) {

  var mapTable = tables.maps;
  var waypointTable = tables.waypoints;
  var pathTable = tables.paths;

  var mapSql = {};

  mapSql.insertMap = function(db, name, x, y, width, height) {
    var query = mapTable.insert(
      mapTable.name.value(name),
      mapTable.x.value(x),
      mapTable.y.value(y),
      mapTable.width.value(width),
      mapTable.height.value(height)
    ).returning().toQuery();
      return db.queryAsync(query.text, query.values)
        .then(function(res) {
          return res.rows[0];
        });
  };

  mapSql.insertWaypoint = function(db, mapId, name, x, y) {
    var query = waypointTable.insert(
      waypointTable.name.value(name),
      waypointTable.map_id.value(mapId),
      waypointTable.name.value(name),
      waypointTable.x.value(x),
      waypointTable.y.value(y)
    ).returning().toQuery();
      return db.queryAsync(query.text, query.values)
        .then(function(res) {
          return res.rows[0];
        });
  };

  mapSql.insertPath = function(db, fromWaypointId, toWaypointId, dir) {
    var query = pathTable.insert(
      pathTable.from_waypoint_id.value(fromWaypointId),
      pathTable.to_waypoint_id.value(toWaypointId),
      pathTable.dir.value(dir)
    ).returning().toQuery();
      return db.queryAsync(query.text, query.values)
        .then(function(res) {
          return res.rows[0];
        });
  };

  return mapSql;
};