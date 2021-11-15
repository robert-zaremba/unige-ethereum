const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Fallback", function() {
  it("should call fallback method on transfer and callCallback", async function() {


    ethers.utils.defaultAbiCoder
    ethers.enco

    // const F = await ethers.getContractFactory("Fallback");
    // const SF = await ethers.getContractFactory("SendToFallback");

    // const f = await F.deploy();
    // await f.deployed();

    // const sf = await SF.deploy();
    // await sf.deployed();

    // let out = await sf.transferToFallback(f.address, { value: 1e6, gasLimit: 30000000});
    // let r = await out.wait();

    // out = await sf.callFallback(f.address, { value: 1e6, gasLimit: 30000000 });
    // r = await out.wait();
    // // console.log(r);
    // assert.lengthOf(r.events, 1);

    // let n = await f.n();
    // assert.equal(n, 0);

    // out = await sf.callIncrement(f.address, 10, { value: 1e6, gasLimit: 30000000 });
    // r = await out.wait();
    // console.log(r);
    // assert.lengthOf(r.events, 0);

    // n = await f.n();
    // assert.equal(n, 10);
  });
});
