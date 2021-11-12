//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract A {
    event FooA(string);
    event BarA(string);

    function foo() public virtual {
        emit FooA("A.foo called");
    }

    function bar() public virtual {
        emit BarA("A.bar called");
    }
}

contract B is A {
    function foo() public virtual override {
        emit FooA("B.foo called");
        A.foo();
    }

    function bar() public virtual override {
        emit BarA("B.bar called");
        super.bar();
    }
}

contract C is A {
    function foo() public virtual override {
        emit FooA("C.foo called");
        A.foo();
    }

    function bar() public virtual override {
        emit BarA("C.bar called");
        super.bar();
    }
}

contract D is B, C {
    // Try:
    // - Call D.foo and check the transaction logs.
    //   Although D inherits A, B and C, it only called C and then A.
    // - Call D.bar and check the transaction logs
    //   D called C, then B, and finally A.
    //   Although super was called twice (by B and C) it only called A once.

    function foo() public override(B, C) {
        super.foo();
    }

    function bar() public override(B, C) {
        super.bar();
    }
}
