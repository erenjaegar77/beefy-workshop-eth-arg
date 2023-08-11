const hardhat = require("hardhat");

const ethers = hardhat.ethers;

const config = {
  address: "0x38554E30927d876185603b2Da66c6db1585A444A"
};

async function main() {
  await hardhat.run("compile");

  await hardhat.run("verify:verify", {
    address: config.address,
    constructorArguments: [],
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


