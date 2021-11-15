//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Fallback {
    event Log(uint gas);

    uint256 public n;

    // Fallback function must be declared as external.
    fallback(bytes calldata data) external payable returns (bytes memory) {
        // send / transfer (forwards 2300 gas to this fallback function)
        // call (forwards all of the gas)
        emit Log(gasleft());
        // console.log("Deploying a Greeter with greeting:", data);
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function increment(uint256 n_) public payable {
        n += n_;
    }




}

contract SendToFallback {
    function transferToFallback(address payable _to) public payable {
        _to.transfer(msg.value);
    }



    function callFallback(address payable _to) public payable {



        bytes memory payload = abi.encodeWithSignature("increment(uint256 n_)", 10);
        (bool sent, ) = _to.call{value: msg.value}(payload);
        require(sent, "Failed to send Ether");
    }

    function callIncrement(address payable _to, uint256 n) public payable {
        bytes memory payload = abi.encodeWithSignature("increment(uint256)", n);
        (bool sent, ) = _to.call{value: msg.value}(payload);
        require(sent, "Failed to send Ether");
    }

}
