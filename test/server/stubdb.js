var stubTransaction = {
	commit: function(callback) { callback(); }
};

var stubDb = {
	beginTransaction: function(callback) {
		callback(undefined, stubTransaction);
	}
};

module.exports = stubDb;