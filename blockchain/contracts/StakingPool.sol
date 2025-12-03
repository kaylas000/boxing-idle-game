// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StakingPool
 * @dev Стейкинг PUNCH токенов для получения пассивного дохода
 * 
 * APY зависит от длительности стейкинга:
 * - 30 дней: 10% APY
 * - 90 дней: 25% APY
 * - 180 дней: 50% APY
 * - 365 дней: 100% APY
 */
contract StakingPool is ReentrancyGuard, Ownable {
    IERC20 public punchToken;

    enum StakingPeriod { Days30, Days90, Days180, Days365 }

    struct Stake {
        uint256 amount;
        uint256 startTime;
        StakingPeriod period;
        bool withdrawn;
    }

    mapping(address => Stake[]) public userStakes;
    mapping(StakingPeriod => uint256) public apyRates;

    uint256 public totalStaked;
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    event Staked(address indexed user, uint256 amount, StakingPeriod period);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);

    constructor(address _punchToken) {
        punchToken = IERC20(_punchToken);

        // APY в базисных пунктах (10000 = 100%)
        apyRates[StakingPeriod.Days30] = 1000;   // 10%
        apyRates[StakingPeriod.Days90] = 2500;   // 25%
        apyRates[StakingPeriod.Days180] = 5000;  // 50%
        apyRates[StakingPeriod.Days365] = 10000; // 100%
    }

    /**
     * @dev Stake токены
     */
    function stake(uint256 amount, StakingPeriod period) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(
            punchToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        userStakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            period: period,
            withdrawn: false
        }));

        totalStaked += amount;

        emit Staked(msg.sender, amount, period);
    }

    /**
     * @dev Вывести stake с наградой
     */
    function withdraw(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        Stake storage userStake = userStakes[msg.sender][stakeIndex];
        require(!userStake.withdrawn, "Already withdrawn");

        uint256 lockDuration = getLockDuration(userStake.period);
        require(
            block.timestamp >= userStake.startTime + lockDuration,
            "Stake is locked"
        );

        uint256 reward = calculateReward(userStake);
        uint256 totalAmount = userStake.amount + reward;

        userStake.withdrawn = true;
        totalStaked -= userStake.amount;

        require(
            punchToken.transfer(msg.sender, totalAmount),
            "Transfer failed"
        );

        emit Withdrawn(msg.sender, userStake.amount, reward);
    }

    /**
     * @dev Рассчитать награду за стейкинг
     */
    function calculateReward(Stake memory userStake) public view returns (uint256) {
        uint256 stakeDuration = block.timestamp - userStake.startTime;
        uint256 apy = apyRates[userStake.period];
        
        // reward = amount * apy * duration / (SECONDS_PER_YEAR * 10000)
        return (userStake.amount * apy * stakeDuration) / (SECONDS_PER_YEAR * 10000);
    }

    /**
     * @dev Получить длительность блокировки
     */
    function getLockDuration(StakingPeriod period) public pure returns (uint256) {
        if (period == StakingPeriod.Days30) return 30 days;
        if (period == StakingPeriod.Days90) return 90 days;
        if (period == StakingPeriod.Days180) return 180 days;
        return 365 days;
    }

    /**
     * @dev Получить все stakes пользователя
     */
    function getUserStakes(address user) external view returns (Stake[] memory) {
        return userStakes[user];
    }

    /**
     * @dev Emergency withdraw без награды (если нужно)
     */
    function emergencyWithdraw(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        Stake storage userStake = userStakes[msg.sender][stakeIndex];
        require(!userStake.withdrawn, "Already withdrawn");

        uint256 amount = userStake.amount;
        // Штраф 10% за ранний вывод
        uint256 penalty = amount / 10;
        uint256 amountToReturn = amount - penalty;

        userStake.withdrawn = true;
        totalStaked -= amount;

        require(
            punchToken.transfer(msg.sender, amountToReturn),
            "Transfer failed"
        );
    }
}
