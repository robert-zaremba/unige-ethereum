const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Factory", function() {
  it("Should create cars", async function() {
    const Factory = await ethers.getContractFactory("Factory");
    const Car = await ethers.getContractFactory("Car");

    const f = await Factory.deploy();
    await f.deployed();

    await f.createCar("ferrari");
    await f.createCar("aston martin");

    let n = await f.num_of_cars();
    assert.equal(n, 2);

    let cAddr = await f.cars(0);
    assert.isString(cAddr, "not a string");
    let c = Car.attach(cAddr);
    assert.equal(await c.name(), "ferrari");

    cAddr = await f.cars(1);
    assert.isString(cAddr, "not a string");
    c = Car.attach(cAddr);
    assert.equal(await c.name(), "aston martin");
  });
});
