const { expect } = require("chai");
const { ethers } = require("hardhat");

/*
   To start:
     yarn install
   or: npm install

   To compile:
     yarn hardhat compile
     npx hardhat compile
   To run test:
     yarn hardhat test test/inheritance-test.js
*/


describe("Inheritance", function() {
  it("Should deploy D", async function() {
    const D = await ethers.getContractFactory("D");
    const d = await D.deploy();
    await d.deployed();

    let out = await d.foo();
    let receipt = await out.wait();
    console.log(out);
    console.log("============");
    console.log(receipt.events[0].args);

    expect(receipt.events.length).equal(2);


    out = await d.bar();
    receipt = await out.wait();
    expect(receipt.events.length).equal(3);

    // TODO: udpate the test to check the events in d.bar(): what events were called?

  });
});
