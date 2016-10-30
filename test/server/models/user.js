var BPromise = require('bluebird');
var sinon = require('sinon');

var chai = require('chai'),
    assert = chai.assert;

var Errors = require('../../../src/server/errors');

var db = BPromise.promisifyAll(require('../stubdb'));

describe('userModel', function() {

    var userSql = require('../../../src/server/sql/user');
    var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));
    var userModel = require('../../../src/server/models/user')(
        userSql, bcrypt, db);

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    })

    describe("#create", function() {

        var TEST_USERNAME = "testuser";
        var TEST_PASSWORD = "testPass123!";
        var TEST_HASH = "*****";
        var TEST_ID = 123;

        it("should return errors on missing username", function() {
            return userModel.create(undefined, TEST_PASSWORD)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.USERNAME_NOT_GIVEN);
                });
        });

        it("should return errors on invalid password", function() {
            return userModel.create(TEST_USERNAME, undefined)
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
            sandbox.stub(userSql, 'insertRow', function(username, hash) {
                return Promise.resolve(
                    username === TEST_USERNAME && hash === TEST_HASH ?
                    TEST_ID : undefined);
            });

            return userModel.create(TEST_USERNAME, TEST_PASSWORD)
                .then(function(user) {
                    assert.equal(user.id, TEST_ID);
                });
        });
    });

    describe("#matchCredentials", function() {

        var TEST_USERNAME = "testuser";
        var TEST_PASSWORD = "testPass123%";
        var TEST_HASH = "testhash";
        var TEST_ID = 123;

        var testUser;

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

            // pretend that creating user with TEST_USERNAME and TEST_HASH
            // results in new user with id TEST_ID
            sandbox.stub(userSql, 'insertRow', function(username, hash, db) {
                return Promise.resolve(
                    username === TEST_USERNAME && hash === TEST_HASH ?
                    TEST_ID : undefined);
            });

            userModel.create(TEST_USERNAME, TEST_PASSWORD, db)
                .then(function(user) {
                    testUser = user;
                    done();
                });
        });

        it("should not return errors on valid credentials", function(done) {
            testUser.matchCredentials("testuser", TEST_PASSWORD)
                .then(function() { done(); });
        });

        it("should return username error on invalid username", function() {
            return testUser.matchCredentials("baduser", TEST_PASSWORD)
                .catch(e => assert.equal(e, Errors.USER_DOES_NOT_EXIST));
        });

        it("should return password error on invalid password", function() {
            return testUser.matchCredentials("testuser", "badpass")
                .catch(e => assert.equal(e, Errors.WRONG_PASSWORD));
        });
    });

});
