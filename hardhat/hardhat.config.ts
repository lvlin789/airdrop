import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const MY_WALLET_PRIVATE_KEY =
  "siyao";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  ignition: {
    strategyConfig: {
      create2: {
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
    },
  },
  etherscan: {
    apiKey: "297Q5YRZSKYDK21E6AB31UGX4N2K18X4X6",
  },
  networks: {
    mainnet: {
      url: "https://eth.llamarpc.com",
      accounts: [MY_WALLET_PRIVATE_KEY],
      chainId: 1,
      gasPrice: 20000000000, // 20 gwei
    },
    kaia: {
      url: "https://public-en.node.kaia.io",
      accounts: [MY_WALLET_PRIVATE_KEY],
      chainId: 8217,
      gasPrice: 20000000000, // 20 gwei
    },
  },
};

export default config;
