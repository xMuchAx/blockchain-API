/** @type import('hardhat/config').HardhatUserConfig */
import "@nomicfoundation/hardhat-ignition-ethers";
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
 const MY_PRIVATE_KEY =
  "f42dff05a6dd9ccc9b19466418703f9b1e0480dd0499efa75a3e2c790cb17d70";

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
