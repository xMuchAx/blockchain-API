const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CatModule", (m) => {
  const cat = m.contract(
    // contract name
    "CatERC1155",
    // contract constructor parameters
    ["https://cat.exemple.fr/token/{id}"]
  );

  return { cat: cat };
});
