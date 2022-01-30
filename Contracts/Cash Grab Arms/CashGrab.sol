// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CashGrabNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
 
    string private _baseTokenURI;

    string public GRAB_PROVENANCE = "";
    
    uint256 public startingIndexBlock;

    uint256 public startingIndex;

    uint256 public REVEAL_TIMESTAMP;
    
    uint256 public cashGrabPrice = 50000000000000000; 
    
    uint public constant maxPurchaseAmt = 20;
    
    uint256 public MAX_CASH_GRAB_NFTS;

    bool public saleIsActive = false;
    
    bool public hasReserved = false;

    constructor(
        uint256 maxSupply,
        uint256 revealDate
    ) public ERC721("CashGrabNFT", "CGNFT") {
        MAX_CASH_GRAB_NFTS = maxSupply;
        REVEAL_TIMESTAMP = revealDate;
    }
    
    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
    
    function reserveNFTs() public onlyOwner {
        require(!hasReserved, "NFTs have already been reserved.");
        _mintCashGrabs(30);
        hasReserved = true;
    }

    function bulkMint(address[] memory _addressList) public onlyOwner {
        require((_tokenIds.current() + _addressList.length) <=  MAX_CASH_GRAB_NFTS, "Mint would exceed max supply of Cash Grabs");
        
        for(uint i = 0; i < _addressList.length; i++) {
            _tokenIds.increment();
            _safeMint(_addressList[i], _tokenIds.current());
        }
    }
    
    function purchase(uint _numberOfTokens) public payable {
        require(saleIsActive, "Sale is not active");
        require(_numberOfTokens <= maxPurchaseAmt, "Can only mint 20 tokens at a time");
        require((cashGrabPrice * _numberOfTokens) == msg.value, "Ether value sent is not correct");
        
        _mintCashGrabs(_numberOfTokens);
    }
    
    function _mintCashGrabs(uint _amountOfTokens) internal nonReentrant {
        require((_tokenIds.current() + _amountOfTokens) <=  MAX_CASH_GRAB_NFTS, "Mint would exceed max supply of Cash Grabs");
        
        for(uint i = 0; i < _amountOfTokens; i++) {
            _tokenIds.increment();
             _safeMint(msg.sender, _tokenIds.current());
        }

        if (startingIndexBlock == 0 && (totalSupply() == MAX_CASH_GRAB_NFTS || block.timestamp >= REVEAL_TIMESTAMP)) {
            _setStartingIndex();
        } 
    }

    // Should only be called once ever.
    function _setStartingIndex() internal {
        require(startingIndex == 0, "Starting index is already set");

        startingIndexBlock = block.number - 1;

        startingIndex = uint(blockhash(startingIndexBlock)) % MAX_CASH_GRAB_NFTS;
    }

    function setRevealTimestamp(uint256 revealTimeStamp) public onlyOwner {
        REVEAL_TIMESTAMP = revealTimeStamp;
    } 
    
    function setProvenanceHash(string memory provenanceHash) public onlyOwner {
        GRAB_PROVENANCE = provenanceHash;
    }
    
    function setBaseURI(string calldata newBaseTokenURI) public onlyOwner {
        _baseTokenURI = newBaseTokenURI;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function changeSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }
    
    function setCashGrabPrice(uint256 Price) public onlyOwner {
        cashGrabPrice = Price;
    } 

    function totalSupply() public view returns (uint256) { 
        return _tokenIds.current(); 
    }
      
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}