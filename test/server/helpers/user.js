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
      return userHelper.createUser(client, undefined, TEST_PASSWORD)
        .then(assert.fail)
        .catch(function(e) {
          assert.equal(e, Errors.USERNAME_NOT_GIVEN);
        });
    });

    it("should return errors on invalid password", function() {
      return userHelper.createUser(client, TEST_USERNAME, undefined)
        .then(assert.fail)
        .catch(function(e) {
          assert.equal(e, Errors.PASSWORD_NOT_GIVEN);
        });
    });

    it("should create a user with given username", function() {
      return userHelper.createUser(client, TEST_USERNAME, TEST_PASSWORD)
        .then(function(user) {
          assert(user);
          assert.equal(user.username, TEST_USERNAME);
        });
    });
  });

  describe("#matchCredentials", function() {

    beforeEach(function() {
      return userHelper.createUser(client, TEST_USERNAME, TEST_PASSWORD);
    });

    it("should not return errors on valid credentials", function(done) {
      userHelper.matchCredentials(client, TEST_USERNAME, TEST_PASSWORD)
        .then(function() { done(); });
    });

    it("should return username error on invalid username", function() {
      return userHelper.matchCredentials(client, "baduser", TEST_PASSWORD)
        .catch(e => assert.equal(e, Errors.USER_DOES_NOT_EXIST));
    });

    it("should return password error on invalid password", function() {
      return userHelper.matchCredentials(client, "testuser", "badpass")
        .catch(e => assert.equal(e, Errors.WRONG_PASSWORD));
    });
  });
};