// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Import the openzepplin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// NFTee is  ERC721 signifies that the contract we are creating imports ERC721 and follows ERC721 contract from openzeppelin
contract BruhBear is ERC721 {
    mapping (address => bool) private list;
    uint public tokenId;
    address public owner;

    constructor() ERC721("Bruh Bear NFT", "BBN") {
        // mint an NFT to yourself
        // _mint(msg.sender, 1);
        owner = msg.sender;
    }

    function checkList() public view returns (bool) {
        return list[msg.sender];
    }

    function safeMint() public {
        require(checkList());

        _safeMint(_msgSender(), tokenId);
    }

    function setCheckList(address _addr, bool _permission) public {
        require(_msgSender() == owner);

        list[_addr] = _permission;
    }
}