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

	beforeEach(function() {
		// can't really clear tables without violating foreign key constraints,
		// so we will wrap our tests inside transactions and rollback after
		return client.queryAsync("BEGIN");
	});

	afterEach(function() {
		sandbox.restore();
		return client.queryAsync("ROLLBACK");
	});

	describe("characterHelper", function() {
		require('./helpers/character')(tables, client, sandbox);
	});

	describe("storyHelper", function() {
		require('./helpers/story')(tables, client, sandbox);
	});

});