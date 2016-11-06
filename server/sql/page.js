module.exports = function(tables) {

	var pageTable = tables.pages;

	var pageSql = {};

	pageSql.insertPages = function(db, pages, storyId) {
		var insertObj = [];
		for (var i = 0; i < pages.length; i++) {
			var pageObj = {};
			pageObj[pageTable.story_id.name] = storyId;
			pageObj[pageTable.idx.name] = i;
			pageObj[pageTable.content.name] = pages[i];
			insertObj.push(pageObj);
		}
	    var query = pageTable.insert(insertObj).returning().toQuery();
	    return db.queryAsync(query.text, query.values)
	    	.then(function(res) {
	    		return res.rows;
	    	});
	};

	return pageSql;
};