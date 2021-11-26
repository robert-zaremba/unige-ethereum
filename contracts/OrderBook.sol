//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
=== ORDER BOOK EXCHANGE ===

PLAN:
+ list of tokens
  + we support only erc-20
  + only admin can add new tokens

+ everyone can make a bid and ask order
+ everyone can cancel his order.
+ settle an order.
  + we can support partial settlement or only "complete" settlement. We want to support partial.

  There are two ways to settle an order. For ask A, and bid B we can either
  1. use exchange deposist: each has to firstly make a deposit to make any order. Order can't be bigger than the user deposit.
  2. or use `transfer_from`: user don't do any deposit to the exchange, but instead he will use active allowances. When B=(sell 10X for 20USD) and A=(buy 10X for 20USDT) then we do:
      * X.transfer_from(user_a, user_b, 10)
      * USDT.transfer_from(user_b, user_a, 20)
        How transfer_from works:
        1. Robert creates allowance to Francesco of 50 USDT
        2. Smart contract creates an allowance record that Francesco can use up to 50USDT of Robert balance.
        3. Francesco can call USDT.transfer_from(Robert, some_othe_address, 30) - this will decrease F. allowance from Robert account to 20USDT.

+ Settlement engine: trading.

+ Stop the exchange if some something bad is happening: admin can shut down orders.

*/



contract OrderBook is Ownable {

    struct Order {
        address trader;
        IERC20 from;
        IERC20 to;
        uint256 price;
        uint256 volume;
    }

    IERC20[] public tokens;

    // map "from" token to "to" token to list of orders
    mapping(IERC20 => mapping(IERC20 => Order[])) public sells;
    mapping(IERC20 => mapping(IERC20 => Order[])) public buys;

    //event Order(uint gas);

    constructor (address owner, IERC20[] memory tokens_) {
        _transferOwnership(owner);
        tokens = tokens_;
    }

    function all_tokens() public view returns(IERC20[] memory) {
        return tokens;
    }

    function register_token(IERC20 token) public onlyOwner {
        require(!token_registered(token), "Token already registered");
        require(tokens.length < 255, "tokens registry is full");
        tokens.push(token);
    }

    // helper functions
    function token_registered(IERC20 token) internal view returns(bool) {
        for (uint8 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == token)
                return true;
        }
        return false;
    }

    // @dev returns true if it settled
    function sell(IERC20 from, IERC20 to, uint256 unit_price, uint256 volume) public returns(bool){
        sells[from][to].push(Order(msg.sender, from, to, unit_price, volume));
        return false;
    }

    // @dev returns true if it settled
    function buy(IERC20 from, IERC20 to, uint256 unit_price, uint256 volume) public returns(bool){
        buys[from][to].push(Order(msg.sender, from, to, unit_price, volume));
        return false;
    }
}
