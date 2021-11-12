//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Car {
    string public name;

    constructor(string name_) public {
        name = name_;
    }
}

contract Factory {

    function createCar(string memory name_) public {
        Car car = new Car(name_);
        cars.push(car);
    }

    // TODO: make it running and
}
