module.exports = function(tables) {

	var pageTable = tables.pages;

	var pageSql = {};

	pageSql.insertPages = function(storyId, pages) {
		var insertObj = [];
		for (var i = 0; i < pages.length; i++) {
			var pageObj = {};
			pageObj[pageTable.storyId.name] = storyId;
			pageObj[pageTable.index.name] = i;
			pageObj[pageTable.text.name] = pages[i];
		}
	    var query = pageTable.insert(insertObj).returning().toQuery();
	    return db.queryAsync(query.text, query.values)
	    	.then(function(res) {
	    		return res.rows;
	    	});
	};

	return pageSql;
};