import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
// import "@typechain/hardhat";
import "./tasks";

import { HardhatUserConfig } from "hardhat/src/types/config";
import { HardhatUserConfig as WithEtherscanConfig } from "hardhat/config";
import { buildHardhatNetworkAccounts, getPKs } from "./utils/configInit";

type DeploymentConfig = HardhatUserConfig & WithEtherscanConfig;

const accounts = getPKs();
const hardhatNetworkAccounts = buildHardhatNetworkAccounts(accounts);

const config: DeploymentConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // accounts visible to hardhat network used by `hardhat node --fork` (yarn net <chainName>)
      accounts: hardhatNetworkAccounts,
    },
    op: {
      url: process.env.OP_RPC || "https://rpc.ankr.com/optimism",
      chainId: 10,
      accounts,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      timeout: 300000,
      accounts: "remote",
    },
  },
  etherscan: {
    apiKey: {
      optimisticEthereum: process.env.OP_API_KEY!,
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
  },
};

export default config;
