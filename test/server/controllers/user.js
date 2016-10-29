var BPromise = require('bluebird');
var sinon = require('sinon');

var chai = require('chai'),
    assert = chai.assert;

var Errors = require('../../../src/server/errors');

describe('userController', function() {

    var userSql;
    var bcrypt;
    var userController;

    before(function() {
        userSql = require('../../../src/server/sql/user');
        bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));
        userController = require('../../../src/server/controllers/user')(userSql, bcrypt);
    });

    describe("#create", function() {

        var TEST_USERNAME = "testuser";
        var TEST_PASSWORD = "testPass123!";
        var TEST_HASH = "*****";
        var TEST_ID = 123;

        it("should return errors on missing username", function() {
            return userController.create(undefined, TEST_PASSWORD)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.USERNAME_NOT_GIVEN);
                });
        });

        it("should return errors on invalid password", function() {
            return userController.create(TEST_USERNAME, undefined)
                .then(assert.fail)
                .catch(function(e) {
                    assert.equal(e, Errors.PASSWORD_NOT_GIVEN);
                });
        });

        it("should create a user with given username", function() {

            // pretend TEST_PASSWORD encrypts to TEST_HASH
            sinon.stub(bcrypt, 'hashAsync', function(password, salt) {
                return Promise.resolve(password === TEST_PASSWORD ? TEST_HASH : undefined);
            });
            // pretend that creating user with TEST_USERNAME and TEST_HASH
            // results in new user with id TEST_ID
            sinon.stub(userSql, 'create', function(username, hash) {
                return Promise.resolve(username === TEST_USERNAME && hash === TEST_HASH ?
                    TEST_ID : undefined);
            });

            return userController.create(TEST_USERNAME, TEST_PASSWORD)
                .then(function(id) {
                    assert.equal(id, TEST_ID);
                });
        });
    });

    describe("#matchCredentials", function() {

        var TEST_USERNAME = "testuser";
        var TEST_PASSWORD = "testPass123%";
        var TEST_HASH = "testhash";

        before(function() {
            // pretend we added username TEST_USERNAME with password TEST_PASSWORD
            var testUser = { "username" : TEST_USERNAME, "password_hash" : TEST_HASH };
            sinon.stub(userSql, 'findByUsername', function(username) {
                return Promise.resolve(username === TEST_USERNAME ? testUser : undefined);
            });
            // pretend that TEST_PASSWORD encrypts to TEST_HASH
            sinon.stub(bcrypt, 'compareAsync', function(password, hash) {
                if (password === TEST_PASSWORD && hash === TEST_HASH) return Promise.resolve();
                return Promise.reject();
            });
        });

        it("should not return errors on valid credentials", function(done) {
            userController.matchCredentials("testuser", TEST_PASSWORD)
                .then(function() { done(); });
        });

        it("should return username error on invalid username", function() {
            return userController.matchCredentials("baduser", TEST_PASSWORD)
                .catch(e => assert.equal(e, Errors.USER_DOES_NOT_EXIST));
        });

        it("should return password error on invalid password", function() {
            return userController.matchCredentials("testuser", "badpass")
                .catch(e => assert.equal(e, Errors.WRONG_PASSWORD));
        });
    });

});
