/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ignition-ethers");
// const { BOB_PRIVATE_KEY } = require("./account.js");
const { BOB_PRIVATE_KEY } = require("./account");

const GANACHE_SERVER = "http://localhost:7545";

module.exports = {
  solidity: "0.8.24",
  paths: {
    root: "./blockchain_core/hardhat",
  },
  networks: {
    ganache: {
      url: GANACHE_SERVER,
      accounts: [
        BOB_PRIVATE_KEY,
        // others accounts
        // privateKey2,
      ],
    },
  },
};
