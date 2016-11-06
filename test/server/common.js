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

	describe("userHelper", function() {
		require('./helpers/user')(client, sandbox);
	});

	describe("inhabitantHelper", function() {
		require('./helpers/inhabitant')(client, sandbox);
	});

	describe("characterHelper", function() {
		require('./helpers/character')(client, sandbox);
	});

	describe("storyHelper", function() {
		require('./helpers/story')(client, sandbox);
	});

});