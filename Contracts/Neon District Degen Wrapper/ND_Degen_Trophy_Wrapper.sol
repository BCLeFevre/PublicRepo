// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract PATrophy {
    function ownerOf(uint256 tokenId) virtual external view returns (address);
    function transfer(address to, uint256 tokenId) virtual external;
    function takeOwnership(uint256 _tokenId) virtual external;
    mapping (uint256 => bytes32) public trophies;
}

contract PineappleArcadeTrophyWrapper is ERC721Enumerable, Ownable {
    
    string private _baseTokenURI;
    
    PATrophy public _PATrophy  = PATrophy(0xf7dDC72B2b2cC275C1b40E289FA158b24a282D90);

    event Wrapped(uint256 indexed trophyId, uint tokenID);
    event Unwrapped(uint256 indexed trophyId, uint tokenID);

    constructor() ERC721("PineappleArcadeTrophyWrapper", "PATW") {}

    function getTrophyName(uint256 _tokenId) public view returns(bytes32 trophyName) {
        return (_PATrophy.trophies(_tokenId));
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {

        bytes32 trophyName = getTrophyName(tokenId);
        string memory description = "A Neon District Trophy, the original top-tier reward granted by Blockade Games only to a rare few for cracking a difficult cryptographic puzzle or contributing to our community. Trophies grant the owner early access to Blockade Games' releases, a role in our Discord, and other secret privileges. Each holder of a Neon District Trophy is among the Neon District elite.";
        string memory json = string(abi.encodePacked('{"name": "', bytes32ToString(trophyName), '", "description": "', description, '", "image": "ipfs://QmbPsqA2kYWdmmFgNkxDYWy5Sr5MhqtVe9zjVU4CAwWLpe", "attributes": [ {"trait_type": "Trophy #", "value": "' ,  uint2str(tokenId), '"}]}'));
        string memory output = string(abi.encodePacked('data:application/json;utf8,', json));

        return output;
    }

    function wrap(uint256 trophyId) public {
        require(_PATrophy.ownerOf(trophyId) == msg.sender, "Not owner of Token"); //only owner can wrap
        _PATrophy.takeOwnership(trophyId);
   
        _mint(msg.sender, trophyId);
        emit Wrapped(trophyId, trophyId);
    }

    function unwrap(uint256 tokenID) public {
        address owner = ownerOf(tokenID);
        require(owner == msg.sender, "Not owner of Wrapped Token"); //only owner can unwrap
        _PATrophy.transfer(owner, tokenID);
        _burn(tokenID);
        emit Unwrapped(tokenID, tokenID);
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}
