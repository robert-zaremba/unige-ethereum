//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    constructor(string memory name_, string memory symbol_, uint256 creator_supply) ERC20(name_, symbol_) {
        _mint(msg.sender, creator_supply);
    }

    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}
