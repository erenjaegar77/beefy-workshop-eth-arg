import hardhat, { ethers, web3 } from "hardhat";
import { addressBook } from "blockchain-addressbook";
import vaultV7 from "../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json";
import vaultV7Factory from "../artifacts/contracts/vaults/BeefyVaultV7Factory.sol/BeefyVaultV7Factory.json";
import stratAbi from "../artifacts/contracts/strategies/StrategyVelodromeGaugeV2.sol/StrategyVelodromeGaugeV2.json";

const {
  platforms: { aerodrome, beefyfinance },
  tokens: {
    AERO: { address: AERO },
    ETH: { address: ETH },
    USDC: { address: USDC },
  },
} = addressBook.base;

const zero = "0x0000000000000000000000000000000000000000";

const want = web3.utils.toChecksumAddress(
  "0x2a1463CeBE85315224c536AfD389b381B43F3206"
);
const gauge = web3.utils.toChecksumAddress(
  "0x9280df579CeA690cAf5c31601cb71564Bb6FA6B7"
);

const MAI = web3.utils.toChecksumAddress(
  "0xbf1aeA8670D2528E08334083616dD9C5F3B087aE"
);

const vaultParams = {
  mooName: "Moo Aero USDC-MAI",
  mooSymbol: "mooAeroUSDC-MAI",
  delay: 21600,
};

const strategyParams = {
  want: want,
  gauge: gauge,
  unirouter: aerodrome.router,
  strategist: process.env.STRATEGIST_ADDRESS,
  keeper: beefyfinance.keeper,
  beefyFeeRecipient: beefyfinance.beefyFeeRecipient,
  feeConfig: beefyfinance.beefyFeeConfig,
  outputToNativeRoute: [
    [AERO, USDC, false, zero],
    [USDC, ETH, false, zero],
  ],
  outputToLp0Route: [[AERO, USDC, false, zero]],
  outputToLp1Route: [
    [AERO, USDC, false, zero],
    [USDC, MAI, false, zero],
  ],
  beefyVaultProxy: beefyfinance.vaultFactory,
  strategyImplementation: "0x4A9E42102d11f6c0A59d77722887E6A104C53636",
  beefySwapper: "0x9F8c6a094434C6E6f5F2792088Bb4d2D5971DdCc",
};

async function main() {
  if (
    Object.values(vaultParams).some((v) => v === undefined) ||
    Object.values(strategyParams).some((v) => v === undefined)
  ) {
    console.error("one of config values undefined");
    return;
  }

  await hardhat.run("compile");

  console.log("Deploying:", vaultParams.mooName);

  const factory = await ethers.getContractAt(
    vaultV7Factory.abi,
    strategyParams.beefyVaultProxy
  );
  const vault = await factory.callStatic.cloneVault();
  let tx = await factory.cloneVault();
  tx = await tx.wait();
  tx.status === 1
    ? console.log(`Vault ${vault} is deployed with tx: ${tx.transactionHash}`)
    : console.log(
        `Vault ${vault} deploy failed with tx: ${tx.transactionHash}`
      );

  const strat = await factory.callStatic.cloneContract(
    strategyParams.strategyImplementation
  );
  let stratTx = await factory.cloneContract(
    strategyParams.strategyImplementation
  );
  stratTx = await stratTx.wait();
  stratTx.status === 1
    ? console.log(
        `Strat ${strat} is deployed with tx: ${stratTx.transactionHash}`
      )
    : console.log(
        `Strat ${strat} deploy failed with tx: ${stratTx.transactionHash}`
      );

  const vaultConstructorArguments = [
    strat,
    vaultParams.mooName,
    vaultParams.mooSymbol,
    vaultParams.delay,
  ];

  const vaultContract = await ethers.getContractAt(vaultV7.abi, vault);
  let vaultInitTx = await vaultContract.initialize(
    ...vaultConstructorArguments
  );
  vaultInitTx = await vaultInitTx.wait();
  vaultInitTx.status === 1
    ? console.log(
        `Vault Intilization done with tx: ${vaultInitTx.transactionHash}`
      )
    : console.log(
        `Vault Intilization failed with tx: ${vaultInitTx.transactionHash}`
      );

  vaultInitTx = await vaultContract.transferOwnership(beefyfinance.vaultOwner);
  vaultInitTx = await vaultInitTx.wait();
  vaultInitTx.status === 1
    ? console.log(
        `Vault OwnershipTransfered done with tx: ${vaultInitTx.transactionHash}`
      )
    : console.log(
        `Vault Intilization failed with tx: ${vaultInitTx.transactionHash}`
      );

  const strategyConstructorArguments = [
    strategyParams.want,
    strategyParams.gauge,
    [
      vault,
      strategyParams.unirouter,
      strategyParams.keeper,
      strategyParams.strategist,
      strategyParams.beefyFeeRecipient,
      strategyParams.feeConfig,
    ],
    strategyParams.outputToNativeRoute,
    strategyParams.outputToLp0Route,
    strategyParams.outputToLp1Route,
    strategyParams.beefySwapper,
  ];

  const abi = stratAbi.abi;
  const stratContract = await ethers.getContractAt(abi, strat);
  const args = strategyConstructorArguments;
  let stratInitTx = await stratContract.initialize(...args);
  stratInitTx = await stratInitTx.wait();
  stratInitTx.status === 1
    ? console.log(
        `Strat Intilization done with tx: ${stratInitTx.transactionHash}`
      )
    : console.log(
        `Strat Intilization failed with tx: ${stratInitTx.transactionHash}`
      );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
