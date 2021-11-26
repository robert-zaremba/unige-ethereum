const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const BigNumber = ethers.BigNumber;
const oneE18 = BigInt("1" + "0".repeat(18));
const zeroAddr = "0x0000000000000000000000000000000000000000";

function BN(x) { return BigNumber.from(x); }

describe("OrderBook", function() {
  let owner, u1, u2, u3;
  let Token;
  let t1, t2, t3;
  let OrderBook;
  let ob;
  let creator_supply = 2e6; // 2 * 10^6 = 2000

  before(async function() {
    [owner, u1, u2, u3] = await ethers.getSigners();
    Token = await ethers.getContractFactory("Token");
    OrderBook = await ethers.getContractFactory("OrderBook");
  });

  beforeEach(async function() {
    [owner, u1, u2, u3] = await ethers.getSigners();

    t1 = await Token.deploy("Gold", "AG", creator_supply);
    t2 = await Token.deploy("Petrol", "PET", creator_supply);
    t3 = await Token.deploy("USD", "USD", creator_supply);
    await Promise.all([t1, t2, t3].map((c) => c.deployed()));

    ob = await OrderBook.deploy(owner.address, [t1.address, t2.address, t3.address]);
    await ob.deployed();
  });

  it("It should have an owner and initial coin list", async function() {
    assert.equal(await ob.owner(), owner.address);

    assert.equal(await ob.tokens(0), t1.address);
    assert.deepEqual(await ob.all_tokens(), [t1.address, t2.address, t3.address]);

    // await t.connect(addr1).mint(addr1_supply);
  });

  it("only admin can add new tokens", async function() {
    let t4 = await Token.deploy("Silver", "AU", creator_supply);
    await t4.deployed();

    // should fail if not owner tries to register a token:
    await expect(ob.connect(u1).register_token(t4.address))
      .revertedWith('Ownable: caller is not the owner');

    await ob.connect(owner).register_token(t4.address);
    assert.equal(await ob.tokens(3), t4.address);
    assert.deepEqual(await ob.all_tokens(), [t1.address, t2.address, t3.address, t4.address]);

    await expect(ob.connect(owner).register_token(t4.address))
      .revertedWith('Token already registered');
  });

  it("everyone can make an order", async function() {
    /*** test creating buy flow ***/
    // from, to, max unit price, volume
    let r = await ob.connect(u1).sell(t1.address, t2.address, 2, 5);
    let sellID = 1;
    await expect(r).to.emit(ob, 'Sell')
      .withArgs(sellID, t1.address, t2.address, 2, 5);
    assert.equal(await ob.order_counter(), sellID);
    assert.equal(await ob.sells(t1.address, t2.address, 0),
      sellID, "sell order is in sell map");
    assert.deepEqual(await ob.orders(sellID),
      [u1.address, t1.address, t2.address, BN(2), BN(5)]);

    /*** test creating sell flow ***/

    r = await ob.connect(u2).buy(t1.address, t3.address, 1, 2);
    let buyID = 2;
    assert.equal(await ob.order_counter(), buyID, "after buy order counter updated");
    await expect(r).to.emit(ob, 'Buy')
      .withArgs(buyID, t1.address, t3.address, 1, 2);
    assert.equal(await ob.buys(t1.address, t3.address, 0),
                 buyID, "buy order is in buy map");
    assert.deepEqual(await ob.orders(buyID),
      [u2.address, t1.address, t3.address, BN(1), BN(2)]);


    /*** test cancel orders ***/

    r = await ob.connect(u1).cancel_order(sellID);
    await expect(r).to.emit(ob, 'CancelOrder')
      .withArgs(sellID);
    assert.equal(await ob.order_counter(), buyID, "order counter shouldn't change");
    assert.deepEqual(await ob.orders(sellID),
                     [zeroAddr, zeroAddr, zeroAddr, BN(0), BN(0)]);

    // reverting when cancelling again the same order
    await expect(ob.connect(u1).cancel_order(sellID))
      .revertedWith("Order doesn't exists");

    // reverting someones else order is not possible
    await expect(ob.connect(u1).cancel_order(buyID))
      .revertedWith("Order owned by someone else");
  });

  /*
    it("", async function() {
    });
*/


  // it ...


});
