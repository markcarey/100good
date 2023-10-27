/** @type import('hardhat/config').HardhatUserConfig */
const dot = require('dotenv').config();

require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
const { API_URL_BASE, API_URL_BASEGOERLI, API_URL_CELO, PRIVATE_KEY, BASESCAN_API_KEY, API_URL_ZKEVMTESTNET, TR8_ONE_PRIV, TR8_TWO_PRIV, TR8_THREE_PRIV } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          evmVersion: 'paris'
        }
      },
      {
        version: '0.8.0'
      }
    ]
  },
  settings: {
    viaIR: true,
    optimizer: {
      enabled: true,
      runs: 200,
      details: {
        yulDetails: {
          optimizerSteps: "u",
        },
      },
    },
  },
  defaultNetwork: "celo",
  networks: {
    hardhat: {
      accounts: [
        { privateKey: `0x${PRIVATE_KEY}`, balance: "10000000000000000000000"},
        { privateKey: `0x${TR8_ONE_PRIV}`, balance: "10000000000000000000000"},
        { privateKey: `0x${TR8_TWO_PRIV}`, balance: "10000000000000000000000"},
        { privateKey: `0x${TR8_THREE_PRIV}`, balance: "10000000000000000000000"}
      ],
      forking: {
        url: API_URL_CELO,
        blockNumber: 22150832,
        gasPrice: 1000000000 * 10,
      },
      loggingEnabled: true,
      gasMultiplier: 10,
      gasPrice: 1000000000 * 500,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true
    },
    baseGoerli: {
      url: API_URL_BASEGOERLI,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 1000000000 * 10,
    },
    base: {
      url: API_URL_BASE,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    zkevm: {
      url: API_URL_ZKEVMTESTNET,
      accounts: [`0x${PRIVATE_KEY}`, `0x${TR8_ONE_PRIV}`],
      //gasPrice: 1000000000 * 10,
    },
    celo: {
      url: API_URL_CELO,
      accounts: [`0x${PRIVATE_KEY}`, `0x${TR8_ONE_PRIV}`],
      //gasPrice: 1000000000 * 10,
    },
  },
   etherscan: {
    apiKey: {
      baseGoerli: "PLACEHOLDER_STRING",
      base: BASESCAN_API_KEY
    },
    customChains: [
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
         apiURL: "https://api-goerli.basescan.org/api",
         browserURL: "https://goerli.basescan.org"
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
         apiURL: "https://api.basescan.org/api",
         browserURL: "https://basescan.org"
        }
      }
    ]
  }
};

