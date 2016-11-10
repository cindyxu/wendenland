var pg = require('pg');
var BPromise = require('bluebird');
var sinon = require('sinon');
var _ = require('lodash');

describe("Server", function() {

	var client = BPromise.promisifyAll(new pg.Client());
	var logClient = {
		queryAsync: function() {
			var queryArgs = arguments;
			return client.queryAsync.apply(client, arguments)
				.catch(function(e) {
					var values = undefined;
					if (typeof queryArgs[1] !== 'function') {
						values = queryArgs[1];
					}
					console.log("Query error:", queryArgs[0], values);
					throw e;
				});
		}
	};
	var sandbox = sinon.sandbox.create();

	before(function() {
		return client.connectAsync();
	});

	after(function() {
		return client.endAsync();
	});

	beforeEach(function() {
		// can't really clear tables without violating foreign key constraints,
		// so we will wrap our tests inside transactions and rollback after
		return client.queryAsync("BEGIN");
	});

	afterEach(function() {
		sandbox.restore();
		return client.queryAsync("ROLLBACK");
	});

	describe("userHelper", function() {
		require('./helpers/user')(logClient, sandbox);
	});

	describe("inhabitantHelper", function() {
		require('./helpers/inhabitant')(logClient, sandbox);
	});

	describe("characterHelper", function() {
		require('./helpers/character')(logClient, sandbox);
	});

	describe("tradeHelper", function() {
		require('./helpers/trade')(logClient, sandbox);
	});

	describe("storyHelper", function() {
		require('./helpers/story')(logClient, sandbox);
	});

});