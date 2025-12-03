// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BoxingNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct FighterAttributes {
        uint256 power;
        uint256 speed;
        uint256 stamina;
        uint256 defense;
        string rarity; // common, rare, epic, legendary
    }
    
    mapping(uint256 => FighterAttributes) public fighterAttributes;
    mapping(address => bool) public minters;
    
    event FighterMinted(uint256 indexed tokenId, address indexed owner, string rarity);
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    constructor() ERC721("Boxing Fighter", "BOXER") Ownable(msg.sender) {}
    
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not a minter");
        _;
    }
    
    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    function mintFighter(
        address player,
        string memory uri,
        uint256 power,
        uint256 speed,
        uint256 stamina,
        uint256 defense,
        string memory rarity
    ) external onlyMinter returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(player, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        fighterAttributes[newTokenId] = FighterAttributes({
            power: power,
            speed: speed,
            stamina: stamina,
            defense: defense,
            rarity: rarity
        });
        
        emit FighterMinted(newTokenId, player, rarity);
        
        return newTokenId;
    }
    
    function getFighterAttributes(uint256 tokenId) external view returns (FighterAttributes memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return fighterAttributes[tokenId];
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
