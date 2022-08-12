//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//for  incrementing numbers
import "@openzeppelin/contracts/utils/Counters.sol";

//defining our storage

contract NFT is ERC721URIStorage {
    //using the counter utility
    using Counters for Counters.Counter;
    //for incrementing value of tokens
    Counters.Counter private _tokenIds;

    //the nft interacts with this contract address for txn
    address contractAddress;

    constructor(address marketPlaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketPlaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        //increment the count the nFT
        _tokenIds.increment();

        //Get the current value of the token
        uint256 newItemId = _tokenIds.current();

        //minting the NFT
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        //given the marketPlace permission to transact
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}
