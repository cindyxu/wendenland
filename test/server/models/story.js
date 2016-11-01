var BPromise = require('bluebird');
var sinon = require('sinon');

var chai = require('chai'),
    assert = chai.assert;

var Errors = require('../../../src/server/errors');

var db = BPromise.promisifyAll(require('../stubdb'));

describe('storyModel', function() {

    var pageSql = require('../../../src/server/sql/page');
    var storySql = require('../../../src/server/sql/story');
    var partySql = require('../../../src/server/sql/party');
    var moveActionSql = require('../../../src/server/sql/move-action');

    var actionModel = require('../../../src/server/models/action')(
        moveActionSql, db);
    var partyModel = require('../../../src/server/models/party')(
        storySql, partySql, db);
    var storyModel = require('../../../src/server/models/story')(
        pageSql, storySql, partyModel, actionModel, db);


    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    })

    describe("#advance", function() {

        var TEST_FROM_STORY_ID = 123;
        var TEST_TO_STORY_ID = 234;
        
        var TEST_PARTY_ID = 345;

        var TEST_ACTION = { "type": "move", "dir": "north" };
        var TEST_PAGE_1_ID = 456;
        var TEST_PAGE_1_TEXT = "You push the door. It creaks open.";
        var TEST_PAGE_2_ID = 567;
        var TEST_PAGE_2_TEXT = "It's dark inside.";

        var TEST_ACTION_ID = 678;

        beforeEach(function() {
            sandbox.stub(pageSql, 'insertRows', function(storyId, pages, db) {
                return;
            });
            sandbox.stub(partySql, 'setStoryId',
                function(partyId, storyId, db) {
                return;
            });
            sandbox.stub(storySql, 'findById',
                function(storyId, db) {
                    return { id: storyId, party_id: TEST_PARTY_ID };
                });
            sandbox.stub(storySql, 'insertRow',
                function(parentId, partyId, actionType, db) {
                    return TEST_TO_STORY_ID;
                });
            sandbox.stub(moveActionSql, 'insertRow',
                function(storyId, dir, db) { return TEST_ACTION_ID; });
        });

        it("should create a story with given pages and actions", function() {
            return storyModel.advance(TEST_FROM_STORY_ID, TEST_ACTION,
                [TEST_PAGE_1_TEXT, TEST_PAGE_2_TEXT], db)
                .then(function(newStoryId) {
                    assert.equal(newStoryId, TEST_TO_STORY_ID);
                });
        });
    });

});
