var BPromise = require('bluebird');
var sinon = require('sinon');

var chai = require('chai'),
    assert = chai.assert;

var Errors = require('../../../src/server/errors');

var db = BPromise.promisifyAll(require('../stubdb'));
var tables = require('../../../src/server/db/tables');

describe('userHelper', function() {

    var userSql = require('../../../src/server/sql/user')(tables);
    var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));
    var userHelper = require('../../../src/server/helpers/user')(
        userSql, bcrypt, db);

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    })

    describe("#createUser", function() {

        var TEST_USERNAME = "testuser";
        var TEST_PASSWORD = "testPass123!";
        var TEST_HASH = "*****";
        var TEST_ID = 123;

        it("should return errors on missing username", function() {
            return userHelper.createUser(undefined, TEST_PASSWORD)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.USERNAME_NOT_GIVEN);
                });
        });

        it("should return errors on invalid password", function() {
            return userHelper.createUser(TEST_USERNAME, undefined)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.PASSWORD_NOT_GIVEN);
                });
        });

        it("should create a user with given username", function() {

            // pretend TEST_PASSWORD encrypts to TEST_HASH
            sandbox.stub(bcrypt, 'hashAsync', function(password, salt) {
                return Promise.resolve(
                    password === TEST_PASSWORD ? TEST_HASH : undefined);
            });
            // pretend that creating user with TEST_USERNAME and TEST_HASH
            // results in new user with id TEST_ID
            sandbox.stub(userSql, 'insertUser', function(username, hash) {
                return Promise.resolve(
                    username === TEST_USERNAME && hash === TEST_HASH ?
                    TEST_ID : undefined);
            });

            return userHelper.createUser(TEST_USERNAME, TEST_PASSWORD)
                .then(function(userId) {
                    assert.equal(userId, TEST_ID);
                });
        });
    });

    describe("#matchCredentials", function() {

        var TEST_USERNAME = "testuser";
        var TEST_PASSWORD = "testPass123%";
        var TEST_HASH = "testhash";
        var TEST_ID = 123;

        beforeEach(function(done) {
            // pretend TEST_PASSWORD encrypts to TEST_HASH
            sandbox.stub(bcrypt, 'hashAsync', function(password, salt) {
                return Promise.resolve(password === TEST_PASSWORD ?
                    TEST_HASH : undefined);
            });
            sandbox.stub(bcrypt, 'compareAsync', function(password, hash) {
                if (password === TEST_PASSWORD && hash === TEST_HASH) {
                    return Promise.resolve();
                }
                return Promise.reject();
            });

            // pretend we have a user in the database
            var resUser = {
                id: TEST_ID, 
                username: TEST_USERNAME,
                password_hash: TEST_HASH };
            sandbox.stub(userSql, 'findUserByUsername', 
                function(username, db) {
                return Promise.resolve(
                    username === TEST_USERNAME ?
                    resUser : undefined);
            });

            done();
        });

        it("should not return errors on valid credentials", function(done) {
            userHelper.matchCredentials("testuser", TEST_PASSWORD)
                .then(function() { done(); });
        });

        it("should return username error on invalid username", function() {
            return userHelper.matchCredentials("baduser", TEST_PASSWORD)
                .catch(e => assert.equal(e, Errors.USER_DOES_NOT_EXIST));
        });

        it("should return password error on invalid password", function() {
            return userHelper.matchCredentials("testuser", "badpass")
                .catch(e => assert.equal(e, Errors.WRONG_PASSWORD));
        });
    });

});
