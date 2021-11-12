//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Car {
    string public name;

    constructor(string memory name_) {
        name = name_;
    }
}

contract Factory {
    Car[] public cars;

    function createCar(string memory name_) public {
        Car car = new Car(name_);
        cars.push(car);
    }

    function num_of_cars() public view returns(uint16) {
        return uint16(cars.length);
    }
}
