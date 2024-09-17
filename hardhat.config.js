/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ignition-ethers");
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
 const MY_PRIVATE_KEY =
  "f42dff05a6dd9ccc9b19466418703f9b1e0480dd0499efa75a3e2c790cb17d70";
// const MY_PUBLIC_ADDRESS = "0x58a1e6Df86a8D44b2C32eF0f3031CCa09d6Fb650";

module.exports = {
  solidity: "0.8.24",
  paths: {
    root: "./blockchain_core/hardhat",
  },
  networks: {
    polygon: {
      url: POLYGON_SERVER,
      accounts: [
        MY_PRIVATE_KEY,
      ],
    },
  },
};
