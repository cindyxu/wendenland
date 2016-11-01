module.exports = function(schemas) {

	var pageSchema = schemas.pages;

	var pageSql = {};

	// this doesn't return anything since it is a batch insert
	pageSql.insertRows = function(storyId, pages) {
		// var insertObj = [];
		// for (var i = 0; i < pages.length; i++) {
		// 	var pageObj = {};
		// 	pageObj[pageSchema.storyId.name] = storyId;
		// 	pageObj[pageSchema.index.name] = i;
		// 	pageObj[pageSchema.text.name] = pages[i];
		// }
	    // var query = pageSchema.insert(insertObj).toQuery();
	    // return db.runAsync(query.text, query.values);
	    throw "Not implemented!";
	};

	return pageSql;
};