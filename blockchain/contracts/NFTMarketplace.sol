// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTMarketplace
 * @dev Маркетплейс для торговли NFT
 * 
 * Особенности:
 * - Листинг NFT за PUNCH токены
 * - Комиссия платформы: 2.5%
 * - Royalty создателю: 5%
 * - Аукционы и фиксированная цена
 */
contract NFTMarketplace is ReentrancyGuard, Ownable {
    IERC721 public nftContract;
    IERC20 public punchToken;

    uint256 public constant PLATFORM_FEE = 250; // 2.5% в базисных пунктах
    uint256 public constant ROYALTY_FEE = 500;  // 5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    struct Auction {
        address seller;
        uint256 startPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 endTime;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Auction) public auctions;

    address public feeReceiver;

    event Listed(uint256 indexed tokenId, address seller, uint256 price);
    event Sold(uint256 indexed tokenId, address seller, address buyer, uint256 price);
    event AuctionCreated(uint256 indexed tokenId, address seller, uint256 startPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 amount);

    constructor(address _nftContract, address _punchToken) {
        nftContract = IERC721(_nftContract);
        punchToken = IERC20(_punchToken);
        feeReceiver = msg.sender;
    }

    /**
     * @dev Выставить NFT на продажу
     */
    function listNFT(uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) ||
            nftContract.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        emit Listed(tokenId, msg.sender, price);
    }

    /**
     * @dev Купить NFT
     */
    function buyNFT(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(msg.sender != listing.seller, "Cannot buy own NFT");

        uint256 price = listing.price;
        
        // Расчёт комиссий
        uint256 platformFee = (price * PLATFORM_FEE) / FEE_DENOMINATOR;
        uint256 royaltyFee = (price * ROYALTY_FEE) / FEE_DENOMINATOR;
        uint256 sellerAmount = price - platformFee - royaltyFee;

        // Переводы
        require(
            punchToken.transferFrom(msg.sender, feeReceiver, platformFee),
            "Platform fee transfer failed"
        );
        require(
            punchToken.transferFrom(msg.sender, feeReceiver, royaltyFee),
            "Royalty transfer failed"
        );
        require(
            punchToken.transferFrom(msg.sender, listing.seller, sellerAmount),
            "Seller payment failed"
        );

        // Передача NFT
        nftContract.safeTransferFrom(listing.seller, msg.sender, tokenId);

        listing.active = false;

        emit Sold(tokenId, listing.seller, msg.sender, price);
    }

    /**
     * @dev Создать аукцион
     */
    function createAuction(
        uint256 tokenId,
        uint256 startPrice,
        uint256 duration
    ) external {
        require(startPrice > 0, "Start price must be > 0");
        require(duration >= 1 hours && duration <= 7 days, "Invalid duration");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not NFT owner");

        auctions[tokenId] = Auction({
            seller: msg.sender,
            startPrice: startPrice,
            currentBid: 0,
            currentBidder: address(0),
            endTime: block.timestamp + duration,
            active: true
        });

        emit AuctionCreated(tokenId, msg.sender, startPrice, block.timestamp + duration);
    }

    /**
     * @dev Сделать ставку на аукционе
     */
    function placeBid(uint256 tokenId, uint256 amount) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(amount > auction.currentBid, "Bid too low");
        require(amount >= auction.startPrice, "Below start price");

        // Вернуть предыдущую ставку
        if (auction.currentBidder != address(0)) {
            require(
                punchToken.transfer(auction.currentBidder, auction.currentBid),
                "Refund failed"
            );
        }

        // Принять новую ставку
        require(
            punchToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        auction.currentBid = amount;
        auction.currentBidder = msg.sender;

        emit BidPlaced(tokenId, msg.sender, amount);
    }

    /**
     * @dev Завершить аукцион
     */
    function endAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction not ended");

        auction.active = false;

        if (auction.currentBidder != address(0)) {
            uint256 price = auction.currentBid;
            
            // Комиссии
            uint256 platformFee = (price * PLATFORM_FEE) / FEE_DENOMINATOR;
            uint256 royaltyFee = (price * ROYALTY_FEE) / FEE_DENOMINATOR;
            uint256 sellerAmount = price - platformFee - royaltyFee;

            // Выплаты
            require(
                punchToken.transfer(feeReceiver, platformFee),
                "Platform fee failed"
            );
            require(
                punchToken.transfer(feeReceiver, royaltyFee),
                "Royalty failed"
            );
            require(
                punchToken.transfer(auction.seller, sellerAmount),
                "Seller payment failed"
            );

            // Передача NFT
            nftContract.safeTransferFrom(
                auction.seller,
                auction.currentBidder,
                tokenId
            );

            emit AuctionEnded(tokenId, auction.currentBidder, price);
        }
    }

    /**
     * @dev Отменить листинг
     */
    function cancelListing(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "Not seller");
        listings[tokenId].active = false;
    }

    function setFeeReceiver(address newReceiver) external onlyOwner {
        feeReceiver = newReceiver;
    }
}
