const {
  getCatContractDeployedAddressFromHardhat,
  getCatContract,
  getReadOnlyCatContract,
  getCatTokenQuantity,
  mintCatToken,
  transferCatToken,
  burnableCatToken,
  addToken
} = require("./contract_service/cat_contract.js");
const {
  ALICE_PRIVATE_KEY,
  ALICE_PUBLIC_ADDRESS,
  BOB_PRIVATE_KEY,
  BOB_PUBLIC_ADDRESS,
  JOHN_PRIVATE_KEY,
  JOHN_PUBLIC_ADDRESS,
} = require("./account.js");

const LOCAL_GANACHE_SERVER = "http://localhost:7545";

const CAT_TOKEN_0 = 0;

const main = async () => {
  // await transferCatToken(LOCAL_GANACHE_SERVER, BOB_PRIVATE_KEY, BOB_PUBLIC_ADDRESS, ALICE_PUBLIC_ADDRESS, CAT_TOKEN_0, 5)
  // await burnableCatToken(LOCAL_GANACHE_SERVER, BOB_PRIVATE_KEY, BOB_PUBLIC_ADDRESS, CAT_TOKEN_0, 10)
  await addToken(LOCAL_GANACHE_SERVER, BOB_PRIVATE_KEY, BOB_PUBLIC_ADDRESS, CAT_TOKEN_0, 1000)

  const bobToken1Qty = await getCatTokenQuantity(
    LOCAL_GANACHE_SERVER,
    BOB_PUBLIC_ADDRESS,
    CAT_TOKEN_0
  );

  const aliceToken1Qty = await getCatTokenQuantity(
    LOCAL_GANACHE_SERVER,
    ALICE_PUBLIC_ADDRESS,
    CAT_TOKEN_0
  );



  console.log("Bob Token qty", bobToken1Qty);
  console.log("Alice Token qty", aliceToken1Qty);
};

main();
