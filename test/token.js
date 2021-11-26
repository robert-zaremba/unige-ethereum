const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const oneE18 = BigInt("1"+"0".repeat(18));

describe("Token", function() {
  let owner, addr1;

  before(async function(){
    [owner, addr1] = await ethers.getSigners();
  });

  it("Should create ERC20", async function() {
    const Token = await ethers.getContractFactory("Token");

    // in JS up to 2^53
    // but in solidity we have 2^256
    // so we have to use BigInt type
    let creator_supply = 10n * oneE18; // 10 tokens
    // 1token = 1 00000000000000 units (18 zeros)
    // 10 tokens = 10 * 1e18

    let t = await Token.deploy("Gold", "AU", creator_supply);
    await t.deployed();

    expect(await t.balanceOf(owner.address)).equal(creator_supply);

    let addr1_supply = 20n;
    await t.connect(addr1).mint(addr1_supply);
    assert.equal(await t.balanceOf(addr1.address), addr1_supply);
  });


});
