// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalIncomeDistribution {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function distributeIncome(address[] memory investors, uint256[] memory amounts) public {
        require(msg.sender == owner, "Only owner can distribute income");
        for (uint256 i = 0; i < investors.length; i++) {
            payable(investors[i]).transfer(amounts[i]);
        }
    }

    receive() external payable {}
}
