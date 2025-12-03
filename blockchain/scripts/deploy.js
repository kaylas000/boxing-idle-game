const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Boxing Champion Contracts...");

  // 1. Deploy PUNCH Token
  console.log("\n📦 Deploying BoxingToken (PUNCH)...");
  const BoxingToken = await hre.ethers.getContractFactory("BoxingToken");
  const punchToken = await BoxingToken.deploy();
  await punchToken.waitForDeployment();
  const punchAddress = await punchToken.getAddress();
  console.log("✅ PUNCH Token deployed to:", punchAddress);

  // 2. Deploy NFT Contract
  console.log("\n📦 Deploying BoxingNFT...");
  const BoxingNFT = await hre.ethers.getContractFactory("BoxingNFT");
  const boxingNFT = await BoxingNFT.deploy();
  await boxingNFT.waitForDeployment();
  const nftAddress = await boxingNFT.getAddress();
  console.log("✅ Boxing NFT deployed to:", nftAddress);

  // 3. Deploy Staking Pool
  console.log("\n📦 Deploying StakingPool...");
  const StakingPool = await hre.ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(punchAddress);
  await stakingPool.waitForDeployment();
  const stakingAddress = await stakingPool.getAddress();
  console.log("✅ Staking Pool deployed to:", stakingAddress);

  // 4. Deploy NFT Marketplace
  console.log("\n📦 Deploying NFTMarketplace...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy(nftAddress, punchAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ NFT Marketplace deployed to:", marketplaceAddress);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contracts: {
      BoxingToken: punchAddress,
      BoxingNFT: nftAddress,
      StakingPool: stakingAddress,
      NFTMarketplace: marketplaceAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("=".repeat(60));

  // Verification commands
  console.log("\n📝 Verify contracts with:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${punchAddress}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${nftAddress}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${stakingAddress} ${punchAddress}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${marketplaceAddress} ${nftAddress} ${punchAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
