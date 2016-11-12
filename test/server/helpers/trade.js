var BPromise = require('bluebird');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var assert = chai.assert;
var should = chai.should();

var tables = require('../../../bin/tables');
var Errors = require('../../../server/errors');

var speciesSql = require('../../../server/sql/species');
var userSql = require('../../../server/sql/user');
var itemSql = require('../../../server/sql/item');
var tradeSql = require('../../../server/sql/trade');
var inhabitantHelper = require('../../../server/helpers/inhabitant');

var TradeStatusTypes =
  require('../../../server/trade-status-types');

module.exports = function(client, sandbox) {
  
  var tradeHelper = require('../../../server/helpers/trade');

  var testSpecies;
  var testFromInhabitant;
  var testToInhabitant;

  beforeEach(function() {
    return speciesSql.insertSpecies(client, "traveller", 0, 0, 0, 0)
      .then(function(resSpecies) {
        testSpecies = resSpecies;
      })
      .then(function() {
        return inhabitantHelper.createInhabitantSeq(
          client, "testcharA", testSpecies);
      })
      .then(function(resInhabitant) {
        testFromInhabitant = resInhabitant;
        return inhabitantHelper.createInhabitantSeq(
          client, "testcharB", testSpecies);
      })
      .then(function(resInhabitant) {
        testToInhabitant = resInhabitant;
      });
  });

  describe("#insertTrade", function() {

    var testTrade;
    beforeEach(function() {
      return tradeHelper.requestTrade(
        client, testFromInhabitant.id, testToInhabitant.id)
        .then(function(resTrade) {
          testTrade = resTrade;
        })
    });

    it("should set requester's status as 'open'", function() {
      assert.equal(testTrade.from_status,
        TradeStatusTypes.OPEN);
    });

    it("should set requestee's status as 'no_action'", function() {
      assert.equal(testTrade.to_status, 
        TradeStatusTypes.NO_ACTION);
    });
  });

  describe("#acceptTrade", function() {

    var testTradeId;
    beforeEach(function() {
      return tradeHelper.requestTrade(
        client, testFromInhabitant.id, testToInhabitant.id)
        .then(function(resTrade) {
          testTradeId = resTrade.id;
          return tradeHelper.acceptTrade(client, testTradeId);
        });
    });

    it("should set requestee's status as 'open'", function() {
      tradeSql.findTradeById(client, testTradeId)
        .then(function(resTrade) {
          assert.equal(resTrade.to_status,
            TradeStatusTypes.OPEN);    
        })
    });
  });

  describe("#addItemToTrade", function() {

    var testItemId;
    var testTradeId;
    beforeEach(function() {

      // insert test item
      return itemSql.insertItemBlueprint(client, "testitem")
        .then(function(resBlueprint) {
          return itemSql.insertItem(
            client, resBlueprint.id, testFromInhabitant.inhabitant_id);
        })
        .then(function(resItem) {
          testItemId = resItem.id;
          return tradeHelper.requestTrade(
            client, testFromInhabitant.id, testToInhabitant.id);
        })
        .then(function(resTrade) {
          testTradeId = resTrade.id;
          return tradeHelper.acceptTrade(client, testTradeId);
        });
    });

    describe("when trade is open", function() {
      it("should create an offer for item", function() {
        return tradeHelper.addItemToTrade(
          client, testTradeId, testFromInhabitant.id, testItemId)
          .then(function(resItemTradeOffer) {
            assert.equal(resItemTradeOffer.inhabitant_id,
              testFromInhabitant.id);
            assert.equal(resItemTradeOffer.trade_id, testTradeId);
            assert.equal(resItemTradeOffer.item_id, testItemId);
          });
      });
    });

    describe("when trade is proposed", function() {
      it("should fail to create offer for item", function() {
        return tradeHelper.proposeTrade(
          client, testTradeId, tradeSql.FROM)
          .then(function() {
            return tradeHelper.proposeTrade(
              client, testTradeId, tradeSql.TO)
          })
          .then(function() {
            return tradeHelper.addItemToTrade(
              client, testTradeId, testFromInhabitant.id, testItemId);
          })
          .should.be.rejectedWith("Cannot change a proposed trade.");
      });
    });

    describe("when trade is cancelled", function() {
      it("should fail to create offer for item", function() {
        return tradeHelper.cancelTrade(
          client, testTradeId, tradeSql.TO)
          .then(function() {
            return tradeHelper.addItemToTrade(
              client, testTradeId, testFromInhabitant.id, testItemId);
          })
          .should.be.rejectedWith("Cannot change a cancelled trade.");
      });
    });

  });

  describe("#proposeTrade", function() {

    var testTradeId;
    beforeEach(function() {
      // open trade
      return tradeHelper.requestTrade(
        client, testFromInhabitant.id, testToInhabitant.id)
        .then(function(resTrade) {
          testTradeId = resTrade.id;
          return tradeHelper.acceptTrade(client, testTradeId);
        })
    });

    describe("from requester", function() {

      beforeEach(function() {
        return tradeHelper.proposeTrade(
          client, testTradeId, tradeSql.FROM);
      });

      it("should set inhabitant's status to 'proposed", function() {
        return tradeSql.findTradeById(client, testTradeId)
          .then(function(resTrade) {
            assert.equal(resTrade.from_status,
              TradeStatusTypes.PROPOSED);
            assert.equal(resTrade.to_status,
              TradeStatusTypes.OPEN);    
          })
      });  
    });

    describe("from requester", function() {

      beforeEach(function() {
        return tradeHelper.proposeTrade(
          client, testTradeId, tradeSql.TO);
      });

      it("should set inhabitant's status to 'proposed", function() {
        return tradeSql.findTradeById(client, testTradeId)
          .then(function(resTrade) {
            assert.equal(resTrade.to_status,
              TradeStatusTypes.PROPOSED);
            assert.equal(resTrade.from_status,
              TradeStatusTypes.OPEN);    
          });
      });  
    });

    describe("when trade is cancelled", function() {

      beforeEach(function() {
        return tradeHelper.cancelTrade(
          client, testTradeId, tradeSql.FROM);
      });

      it("should fail to propose", function() {
        return tradeHelper.proposeTrade(
          client, testTradeId, tradeSql.FROM)
          .should.be.rejectedWith("Cannot change a cancelled trade.");
      });
    });

  });

  describe("#cancelTrade", function() {

    var testTradeId;
    beforeEach(function() {
      return tradeHelper.requestTrade(
        client, testFromInhabitant.id, testToInhabitant.id)
        .then(function(resTrade) {
          testTradeId = resTrade.id;
        });
    });

    describe("from requester", function() {

      beforeEach(function() {
        return tradeHelper.cancelTrade(
          client, testTradeId, tradeSql.FROM)
      });

      it("should set inhabitant's status to 'cancelled", function() {
        return tradeSql.findTradeById(client, testTradeId)
          .then(function(resTrade) {
            assert.equal(resTrade.to_status,
              TradeStatusTypes.NO_ACTION);
            assert.equal(resTrade.from_status,
              TradeStatusTypes.CANCELLED);    
          });
      });

    });

    describe("from requestee", function() {

      beforeEach(function() {
        return tradeHelper.cancelTrade(
          client, testTradeId, tradeSql.TO)
      });

      it("should set inhabitant's status to 'cancelled", function() {
        return tradeSql.findTradeById(client, testTradeId)
          .then(function(resTrade) {
            assert.equal(resTrade.to_status,
              TradeStatusTypes.CANCELLED);
            assert.equal(resTrade.from_status,
              TradeStatusTypes.OPEN);
          });
      });

    });

    describe("when trade is confirmed", function() {

      beforeEach(function() {
        return tradeHelper.acceptTrade(
          client, testTradeId)
          .then(function() {
            return tradeHelper.proposeTrade(client, testTradeId, tradeSql.FROM);
          })
          .then(function() {
            return tradeHelper.proposeTrade(client, testTradeId, tradeSql.TO);
          })
          .then(function() {
            return tradeHelper.confirmTradeSeq(
              client, testTradeId, tradeSql.FROM);
          })
          .then(function() {
            return tradeHelper.confirmTradeSeq(
              client, testTradeId, tradeSql.TO);
          });
      })
      
      it("should fail to cancel", function() {
        return tradeHelper.cancelTrade(
          client, testTradeId, tradeSql.FROM)
          .should.be.rejectedWith("Cannot change a finished trade.");
      });
    });
  });

  describe("#reopenTrade", function() {

    var testTradeId;
    beforeEach(function() {
      return tradeHelper.requestTrade(
        client, testFromInhabitant.id, testToInhabitant.id)
        .then(function(resTrade) {
          testTradeId = resTrade.id;
          return tradeHelper.acceptTrade(client, testTradeId);
        })
        .then(function() {
          return tradeHelper.proposeTrade(
            client, testTradeId, tradeSql.FROM);
        })
        .then(function() {
          return tradeHelper.proposeTrade(
            client, testTradeId, tradeSql.TO);
        });
    });

    it("should set inhabitant's status to 'open'", function() {
      return tradeHelper.reopenTrade(client, testTradeId, tradeSql.FROM)
        .then(function() {
          return tradeSql.findTradeById(client, testTradeId)
          .then(function(resTrade) {
            assert.equal(resTrade.from_status,
              TradeStatusTypes.OPEN);
          });
        })
    });

    describe("when one inhabitant has confirmed", function() {

      beforeEach(function() {
        return tradeHelper.confirmTradeSeq(
          client, testTradeId, tradeSql.TO);
      });

      it("should set inhabitant's status back to 'proposed'", function() {
        return tradeHelper.reopenTrade(client, testTradeId, tradeSql.FROM)
          .then(function() {
            return tradeSql.findTradeById(client, testTradeId);
          })
          .then(function(resTrade) {
            assert.equal(resTrade.to_status, TradeStatusTypes.PROPOSED);
          })
      });
    });

    describe("when trade is cancelled", function() {

      beforeEach(function() {
        return tradeHelper.cancelTrade(
          client, testTradeId, tradeSql.TO);
      });

      it("should fail to reopen trade", function() {
        return tradeHelper.reopenTrade(client, testTradeId, tradeSql.FROM)
          .should.be.rejectedWith("Cannot change a cancelled trade.");
      });
    });

    describe("when trade is confirmed", function() {

      beforeEach(function() {
        return tradeHelper.confirmTradeSeq(client, testTradeId, tradeSql.FROM)
          .then(function() {
            return tradeHelper.confirmTradeSeq(
              client, testTradeId, tradeSql.TO);
          });
      });

      it("should fail to reopen trade", function() {
        return tradeHelper.reopenTrade(client, testTradeId, tradeSql.FROM)
          .should.be.rejectedWith("Cannot change a finished trade.");
      });
    });
  });

  describe("#confirmTradeSeq", function() {

    var testItem1Id;
    var testItem2Id;
    var testTradeId;
    beforeEach(function() {
      var testBlueprintId;
      // insert test item
      return itemSql.insertItemBlueprint(client, "testitem")
        .then(function(resBlueprint) {
          testBlueprintId = resBlueprint.id;
          return itemSql.insertItem(
            client, testBlueprintId, testFromInhabitant.inhabitant_id);
        })
        .then(function(resItem) {
          testItem1Id = resItem.id;
          return itemSql.insertItem(
            client, testBlueprintId, testToInhabitant.inhabitant_id);
        })
        .then(function(resItem) {
          testItem2Id = resItem.id;
          
          // open trade
          return tradeHelper.requestTrade(
            client, testFromInhabitant.id, testToInhabitant.id);
        })
        .then(function(resTrade) {
          testTradeId = resTrade.id;
          return tradeHelper.acceptTrade(client, testTradeId);
        })

        // add items
        .then(function() {
          return tradeHelper.addItemToTrade(
            client, testTradeId, testFromInhabitant.id, testItem1Id);
        })
        .then(function() {
          return tradeHelper.addItemToTrade(
            client, testTradeId, testToInhabitant.id, testItem2Id);
        })
    });

    describe("when both parties have proposed", function() {
      beforeEach(function() {
        return tradeHelper.proposeTrade(
          client, testTradeId, tradeSql.FROM)
        .then(function() {
          return tradeHelper.proposeTrade(
            client, testTradeId, tradeSql.TO);
        });
      });

      it("should set inhabitant's status to 'confirmed", function() {

        return tradeHelper.confirmTradeSeq(
          client, testTradeId, tradeSql.FROM)
          .then(function() {
            return tradeSql.findTradeById(client, testTradeId)
            .then(function(resTrade) {
              assert.equal(resTrade.from_status,
                TradeStatusTypes.CONFIRMED);
              assert.equal(resTrade.to_status,
                TradeStatusTypes.PROPOSED);
            });
          });

      });

      describe("when both parties confirm", function() {
        it("should trade the items offered", function() {

          return tradeHelper.confirmTradeSeq(
            client, testTradeId, tradeSql.FROM)

            .then(function() {
              return tradeHelper.confirmTradeSeq(
                client, testTradeId, tradeSql.TO);
            })

            .then(function() {
              // assert that testItem1 has been moved to testToInhabitant.
              return itemSql.findItemById(client, testItem1Id)
                .then(function(resItem) {
                  assert.equal(resItem.inhabitant_id, testToInhabitant.id);
                  
                  // assert that testItem2 has been moved to testFromInhabitant.
                  return itemSql.findItemById(client, testItem2Id);
                })
                .then(function(resItem) {
                  assert.equal(resItem.inhabitant_id, testFromInhabitant.id);
                });
            });
        });
      });

    });

    describe("when trade is cancelled", function() {
      it("should fail to confirm", function() {
        return tradeHelper.cancelTrade(
          client, testTradeId, tradeSql.FROM)
          .then(function() {
            return tradeHelper.confirmTradeSeq(
              client, testTradeId, tradeSql.FROM);
          })
          .should.be.rejectedWith("Cannot change a cancelled trade.");
      });
    });

    describe("when one party is open", function() {
      it("should fail to confirm", function() {
        return tradeHelper.proposeTrade(
          client, testTradeId, tradeSql.FROM)
          .then(function() {
            return tradeHelper.confirmTradeSeq(
              client, testTradeId, tradeSql.FROM);
          }).should.be.rejectedWith("Cannot confirm an open trade.");
      });
    });

  });
};