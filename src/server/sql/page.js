module.exports = function(tables) {

	var pageTable = tables.pages;

	var pageSql = {};

	// this doesn't return anything since it is a batch insert
	pageSql.insertPages = function(storyId, pages) {
		// var insertObj = [];
		// for (var i = 0; i < pages.length; i++) {
		// 	var pageObj = {};
		// 	pageObj[pageTable.storyId.name] = storyId;
		// 	pageObj[pageTable.index.name] = i;
		// 	pageObj[pageTable.text.name] = pages[i];
		// }
	    // var query = pageTable.insert(insertObj).toQuery();
	    // return db.runAsync(query.text, query.values);
	    throw "Not implemented!";
	};

	return pageSql;
};