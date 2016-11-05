// var tables = require.main.require(process.env.DB_TABLES);

// var BPromise = require('bluebird');
// var sinon = require('sinon');

// var chai = require('chai'),
//     assert = chai.assert;

// var Errors = require('../../../server/errors');

// var pageSql = require('../../../server/sql/page')(tables);
// var storySql = require('../../../server/sql/story')(tables);
// var partySql = require('../../../server/sql/party')(tables);
// var actionSql = require('../../../server/sql/action')(tables);

// describe('storyHelper', function() {

// 	var client = BPromise.promisifyAll(new pg.Client());

//     var actionHelper = require('../../../server/helpers/action')(
//         actionSql, client);
//     var partyHelper = require('../../../server/helpers/party')(
//         storySql, partySql, client);
//     var storyHelper = require('../../../server/helpers/story')(
//         pageSql, storySql, partyHelper, actionHelper, client);

//     var sandbox;

//     before(function() {
//         return client.connectAsync();
//     });

//     after(function() {
//         return client.endAsync();
//     })

//     beforeEach(function() {
//         sandbox = sinon.sandbox.create();
//     });

//     afterEach(function() {
//         sandbox.restore();
//         return BPromise.all(_.map(tables, function(table) {
//             return client.queryAsync(table.delete().toQuery());
//         }));
//     })

//     describe("#advanceStory", function() {

//         var TEST_FROM_STORY_ID = 123;
//         var TEST_TO_STORY_ID = 234;
        
//         var TEST_PARTY_ID = 345;

//         var TEST_ACTION = { "type": "move", "dir": "north" };
//         var TEST_PAGE_1_ID = 456;
//         var TEST_PAGE_1_TEXT = "You push the door. It creaks open.";
//         var TEST_PAGE_2_ID = 567;
//         var TEST_PAGE_2_TEXT = "It's dark inside.";

//         var TEST_ACTION_ID = 678;

//         before(function() {
        	
//     	});

//         it("should create a story with given pages and actions", function() {
//             return storyHelper.advanceStorySeq(TEST_FROM_STORY_ID,
//                 TEST_ACTION, [TEST_PAGE_1_TEXT, TEST_PAGE_2_TEXT], db)
//                 .then(function(newStoryId) {
//                     assert.equal(newStoryId, TEST_TO_STORY_ID);
//                 });
//         });
//     });

// });
