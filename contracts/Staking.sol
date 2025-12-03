// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is ReentrancyGuard, Ownable {
    IERC20 public boxToken;
    
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lockDuration;
        uint256 rewardDebt;
    }
    
    mapping(address => StakeInfo[]) public stakes;
    
    uint256 public rewardRate = 100; // 1% per day = 100 basis points
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount, uint256 duration);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardClaimed(address indexed user, uint256 reward);
    
    constructor(address _boxToken) Ownable(msg.sender) {
        boxToken = IERC20(_boxToken);
    }
    
    function stake(uint256 amount, uint256 lockDuration) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(lockDuration >= 7 days, "Min lock 7 days");
        require(lockDuration <= 365 days, "Max lock 365 days");
        
        boxToken.transferFrom(msg.sender, address(this), amount);
        
        stakes[msg.sender].push(StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            lockDuration: lockDuration,
            rewardDebt: 0
        }));
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount, lockDuration);
    }
    
    function unstake(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        
        StakeInfo storage stakeInfo = stakes[msg.sender][stakeIndex];
        require(block.timestamp >= stakeInfo.startTime + stakeInfo.lockDuration, "Still locked");
        
        uint256 reward = calculateReward(msg.sender, stakeIndex);
        uint256 total = stakeInfo.amount + reward;
        
        totalStaked -= stakeInfo.amount;
        
        // Remove stake
        stakes[msg.sender][stakeIndex] = stakes[msg.sender][stakes[msg.sender].length - 1];
        stakes[msg.sender].pop();
        
        boxToken.transfer(msg.sender, total);
        
        emit Unstaked(msg.sender, stakeInfo.amount, reward);
    }
    
    function calculateReward(address user, uint256 stakeIndex) public view returns (uint256) {
        StakeInfo storage stakeInfo = stakes[user][stakeIndex];
        
        uint256 stakingDuration = block.timestamp - stakeInfo.startTime;
        uint256 reward = (stakeInfo.amount * rewardRate * stakingDuration) / (365 days * 10000);
        
        return reward - stakeInfo.rewardDebt;
    }
    
    function claimReward(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        
        uint256 reward = calculateReward(msg.sender, stakeIndex);
        require(reward > 0, "No rewards");
        
        stakes[msg.sender][stakeIndex].rewardDebt += reward;
        
        boxToken.transfer(msg.sender, reward);
        
        emit RewardClaimed(msg.sender, reward);
    }
    
    function getStakeCount(address user) external view returns (uint256) {
        return stakes[user].length;
    }
    
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 10000, "Rate too high"); // Max 100% APY
        rewardRate = newRate;
    }
}
