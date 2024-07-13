import * as dotenv from "dotenv";
dotenv.config();
// import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
// import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

const privateKey = process.env.PRIVATE_KEY || "";
const alchemyApiKey = process.env.ALCHEMY_API_KEY || "";
const polygonScanApiKey = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  // module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  defaultNetwork: "polygonAmoy",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      // url: `https://rpc-amoy.polygon.technology/`,
      accounts: [privateKey as string],
      // accounts: [alchemyApiKey as string],
      // accounts: [polygonScanApiKey as string],
      gasPrice: "auto",
    },
    hardhat: {
      forking: {
        url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        // accounts: [privateKey],
      },
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [privateKey],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    // polygonAmoy: process.env.POLYGONSCAN_API_KEY,
  },
};
export default config;

/**** THIS IS THE CODE FROM SCAFFOLD-ETH, ABOVE IS FROM @ PETER ON DAPP UNIVERSITY SLACK "BLOCKCHAIN MASTERY", 25 JUNE 2024 */
// import * as dotenv from "dotenv";
// dotenv.config();
// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-ethers";
// import "@nomicfoundation/hardhat-chai-matchers";
// import "@typechain/hardhat";
// import "hardhat-gas-reporter";
// import "solidity-coverage";
// import "@nomicfoundation/hardhat-verify";
// import "hardhat-deploy";
// import "hardhat-deploy-ethers";

// // If not set, it uses ours Alchemy's default API key.
// // You can get your own at https://dashboard.alchemyapi.io
// const alchemyProviderApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
// const infuraProviderApiKey = process.env.INFURA_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
// // If not set, it uses the hardhat account 0 private key.
// const deployerPrivateKey =
//   process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// // If not set, it uses ours Etherscan default API key.
// const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

// const config: HardhatUserConfig = {
//   solidity: {
//     version: "0.8.20",
//     settings: {
//       optimizer: {
//         enabled: true,
//         // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
//         runs: 200,
//       },
//     },
//   },
//   defaultNetwork: "Amoy",
//   // defaultNetwork: "localhost",
//   namedAccounts: {
//     deployer: {
//       // By default, it will take the first Hardhat account as the deployer
//       default: 0,
//     },
//   },
//   networks: {
//     // View the networks that are pre-configured.
//     // If the network you are looking for is not here you can add new network settings
//     Amoy: {
//       // url: `https://polygon-amoy.infura.io/v3/${infuraProviderApiKey}`,
//       url: `https://polygon-amoy.g.alchemy.com/v2/${alchemyProviderApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//   },
//   // configuration for harhdat-verify plugin
//   etherscan: {
//     apiKey: `${etherscanApiKey}`,
//   },
//   // configuration for etherscan-verify from hardhat-deploy plugin
//   verify: {
//     etherscan: {
//       apiKey: `${etherscanApiKey}`,
//     },
//   },
//   sourcify: {
//     enabled: false,
//   },
// };

// export default config;
