var tables = require.main.require(process.env.DB_TABLES);

var pg = require('pg');
var BPromise = require('bluebird');
var sinon = require('sinon');
var _ = require('lodash');

describe("Server", function() {

	var client = BPromise.promisifyAll(new pg.Client());
	var sandbox = sinon.sandbox.create();

	before(function() {
		return client.connectAsync();
	});

	after(function() {
		return client.endAsync();
	});

	afterEach(function() {
		sandbox.restore();
		return BPromise.all(_.map(tables, function(table) {
			return client.queryAsync(table.delete().toQuery());
		}));
	});

	describe("characterHelper", function() {
		require('./helpers/character')(tables, client, sandbox);
	});

});