// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BoxingNFT
 * @dev NFT для боксёров, тренеров, залов и экипировки
 * 
 * Типы NFT:
 * - 1: Boxer (уникальный боксёр)
 * - 2: Trainer (легендарный тренер)
 * - 3: Gym (эксклюзивный зал)
 * - 4: Equipment (редкая экипировка)
 */
contract BoxingNFT is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    enum NFTType { Boxer, Trainer, Gym, Equipment }
    enum Rarity { Common, Rare, Epic, Legendary }

    struct NFTMetadata {
        NFTType nftType;
        Rarity rarity;
        uint256 power;
        uint256 speed;
        uint256 stamina;
        uint256 defense;
        uint256 mintedAt;
        string name;
    }

    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(address => uint256[]) public userNFTs;

    // Royalty: 5% на вторичный рынок
    uint256 public constant ROYALTY_PERCENTAGE = 5;
    address public royaltyReceiver;

    event NFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        NFTType nftType,
        Rarity rarity
    );

    constructor() ERC721("Boxing NFT", "BNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        royaltyReceiver = msg.sender;
    }

    /**
     * @dev Mint NFT с заданными характеристиками
     */
    function mintNFT(
        address to,
        string memory uri,
        NFTType nftType,
        Rarity rarity,
        uint256 power,
        uint256 speed,
        uint256 stamina,
        uint256 defense,
        string memory nftName
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        nftMetadata[tokenId] = NFTMetadata({
            nftType: nftType,
            rarity: rarity,
            power: power,
            speed: speed,
            stamina: stamina,
            defense: defense,
            mintedAt: block.timestamp,
            name: nftName
        });

        userNFTs[to].push(tokenId);

        emit NFTMinted(to, tokenId, nftType, rarity);
        return tokenId;
    }

    /**
     * @dev Получить все NFT пользователя
     */
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }

    /**
     * @dev Получить метаданные NFT
     */
    function getNFTMetadata(uint256 tokenId) external view returns (NFTMetadata memory) {
        require(_exists(tokenId), "NFT does not exist");
        return nftMetadata[tokenId];
    }

    /**
     * @dev Royalty info для ERC2981
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount) {
        require(_exists(tokenId), "NFT does not exist");
        return (royaltyReceiver, (salePrice * ROYALTY_PERCENTAGE) / 100);
    }

    function setRoyaltyReceiver(address newReceiver) external onlyRole(DEFAULT_ADMIN_ROLE) {
        royaltyReceiver = newReceiver;
    }

    // Override functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
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
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
