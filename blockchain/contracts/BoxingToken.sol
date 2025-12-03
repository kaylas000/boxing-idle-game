// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title BoxingToken (PUNCH)
 * @dev Игровой токен для Boxing Champion
 * 
 * Особенности:
 * - Mintable: игроки зарабатывают токены за победы
 * - Burnable: токены сжигаются при покупке улучшений
 * - Pausable: можно приостановить в случае проблем
 * - AccessControl: роли для управления
 */
contract BoxingToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");

    // Максимальная эмиссия: 1 миллиард токенов
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    // Лимиты для защиты от злоупотреблений
    uint256 public constant MAX_MINT_PER_TX = 1_000 * 10**18;
    uint256 public constant DAILY_MINT_LIMIT = 100_000 * 10**18;

    // Tracking дневных лимитов
    mapping(address => uint256) public lastMintDay;
    mapping(address => uint256) public dailyMintAmount;

    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount, string reason);

    constructor() ERC20("Boxing Token", "PUNCH") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        // Начальная эмиссия: 10% для ликвидности и награды
        _mint(msg.sender, 100_000_000 * 10**18);
    }

    /**
     * @dev Mint токены игроку за игровые достижения
     */
    function mintReward(
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyRole(GAME_ROLE) whenNotPaused {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        require(amount <= MAX_MINT_PER_TX, "Exceeds max mint per tx");

        // Проверка дневного лимита
        uint256 currentDay = block.timestamp / 1 days;
        if (lastMintDay[to] != currentDay) {
            lastMintDay[to] = currentDay;
            dailyMintAmount[to] = 0;
        }
        require(
            dailyMintAmount[to] + amount <= DAILY_MINT_LIMIT,
            "Daily mint limit exceeded"
        );

        dailyMintAmount[to] += amount;
        _mint(to, amount);

        emit TokensMinted(to, amount, reason);
    }

    /**
     * @dev Сжигание токенов при покупке в игре
     */
    function burnForUpgrade(
        address from,
        uint256 amount,
        string calldata reason
    ) external onlyRole(GAME_ROLE) whenNotPaused {
        _burn(from, amount);
        emit TokensBurned(from, amount, reason);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
