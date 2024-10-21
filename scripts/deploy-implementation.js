const hardhat = require("hardhat");

const ethers = hardhat.ethers;

const config = {
  name: "StrategyVelodromeGaugeV2",
  verify: false
};

async function main() {
  await hardhat.run("compile");

  const Strategy = await ethers.getContractFactory(config.name);
  const strategy = await Strategy.deploy();
  await strategy.deployed();

  console.log("Candidate deployed to:", strategy.address);

  if (config.verify) {
    await hardhat.run("verify:verify", {
      address: strategy.address,
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
