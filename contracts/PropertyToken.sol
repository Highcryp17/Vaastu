// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyToken is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public propertyPrices;

    constructor() ERC721("PropertyToken", "PROP") Ownable(msg.sender) {
        // `Ownable(msg.sender)` sets the contract deployer as the initial owner
    }

    function mintProperty(address to, uint256 price) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _mint(to, tokenId);
        propertyPrices[tokenId] = price;
    }

    function transferProperty(address from, address to, uint256 tokenId) external payable {
        require(msg.value == propertyPrices[tokenId], "Incorrect price sent");
        _transfer(from, to, tokenId);
        payable(from).transfer(msg.value);
    }
}
