var BPromise = require('bluebird');
var chai = require('chai'),
  assert = chai.assert;

var Errors = require('../../../server/errors');

module.exports = function(tables, client, sandbox) {

  var userSql = require('../../../server/sql/user')(tables);
  var bcrypt = BPromise.promisifyAll(require("bcrypt-nodejs"));
  var userHelper = require('../../../server/helpers/user')(
    userSql, bcrypt);

  var TEST_USERNAME = "testuser";
  var TEST_PASSWORD = "testPass123!";

  describe("#createUser", function() {

    it("should return errors on missing username", function() {
      return userHelper.createUser(undefined, TEST_PASSWORD, client)
        .then(assert.fail)
        .catch(function(e) {
          assert.equal(e, Errors.USERNAME_NOT_GIVEN);
        });
    });

    it("should return errors on invalid password", function() {
      return userHelper.createUser(TEST_USERNAME, undefined, client)
        .then(assert.fail)
        .catch(function(e) {
          assert.equal(e, Errors.PASSWORD_NOT_GIVEN);
        });
    });

    it("should create a user with given username", function() {
      return userHelper.createUser(TEST_USERNAME, TEST_PASSWORD, client)
        .then(function(user) {
          assert(user);
          assert.equal(user.username, TEST_USERNAME);
        });
    });
  });

  describe("#matchCredentials", function() {

    beforeEach(function() {
      return userHelper.createUser(TEST_USERNAME, TEST_PASSWORD, client);
    });

    it("should not return errors on valid credentials", function(done) {
      userHelper.matchCredentials(TEST_USERNAME, TEST_PASSWORD, client)
        .then(function() { done(); });
    });

    it("should return username error on invalid username", function() {
      return userHelper.matchCredentials("baduser", TEST_PASSWORD, client)
        .catch(e => assert.equal(e, Errors.USER_DOES_NOT_EXIST));
    });

    it("should return password error on invalid password", function() {
      return userHelper.matchCredentials("testuser", "badpass", client)
        .catch(e => assert.equal(e, Errors.WRONG_PASSWORD));
    });
  });
};