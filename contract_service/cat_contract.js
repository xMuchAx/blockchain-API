import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join } from "path";
const __dirname = import.meta.dirname;

const CatERC1155_json =
  "../blockchain_core/hardhat/artifacts/contracts/cat.sol/CatERC1155.json";

const CatERC1155Deployed_json =
  "../blockchain_core/hardhat/ignition/deployments/chain-1337/deployed_addresses.json";

/////////////////////////////////////////////////////////////////////////////
// Helpers specific to the Cat contract
/////////////////////////////////////////////////////////////////////////////

// For read only operation on the contract
// No need of an account to read data from the blockchain
export function getReadOnlyCatContract(
  blockchainServerUrl,
  catContractDeployedAddress
) {
  const noNeedOfAccount = null;
  return getCatContract(
    blockchainServerUrl,
    noNeedOfAccount,
    catContractDeployedAddress
  );
}

// For read only operations that do not need an account, you can set accountPrivateKey to null
function getCatContract(
  blockchainServerUrl,
  accountPrivateKey,
  catContractDeployedAddress
) {
  const provider = new ethers.getDefaultProvider(blockchainServerUrl);

  // By default. we consider that we only read the blockchain
  // For modification operation on the blockchainm we need an account (private key)
  let contractRunner = provider;

  if (accountPrivateKey !== null) {
    // use the account as the contract runner

    // create a wallet from a private key
    const wallet = new ethers.Wallet(accountPrivateKey);

    // Attach this wallet with the connection to the provider
    const connectedWallet = wallet.connect(provider);

    contractRunner = connectedWallet;
  }

  // get the contract ABI
  const catContractAbiJson = getCatContractAbiFromHardhat();

  // create a Contract object that poins to the deployed contract on the blockchain
  // This instance will be used to interact with the contract later
  const contract = new ethers.Contract(
    catContractDeployedAddress,
    catContractAbiJson,
    contractRunner
  );

  return contract;
}

export function getCatContractAbiFromHardhat() {
  const jsonFile = join(__dirname, CatERC1155_json);
  const compiled_contract = JSON.parse(readFileSync(jsonFile).toString());
  const abi_json = compiled_contract.abi;

  return abi_json;
}

export function getCatContractDeployedAddressFromHardhat() {
  const jsonFile = join(__dirname, CatERC1155Deployed_json);
  const catContractJson = JSON.parse(readFileSync(jsonFile).toString());
  const deployedAddress = catContractJson["CatModule#CatERC1155"];

  return deployedAddress;
}

/////////////////////////////////////////////////////////////////////////////
// Services provided by the Cat contract
/////////////////////////////////////////////////////////////////////////////

//function to get token quantity from an accout
export async function getCatTokenQuantity(blockchainServerUrl, tokenAccount, tokenId) {
  const catContract = getReadOnlyCatContract(
    blockchainServerUrl,
    getCatContractDeployedAddressFromHardhat()
  );

  const accountPublicAddress = tokenAccount;
  const tokenQuantity = await catContract.balanceOf(
    accountPublicAddress,
    tokenId
  );

  return tokenQuantity;
}

//function to transfert token from an account to other acount
export async function transferCatToken(
  blockchainServerUrl,
  ownerPrivateKey,
  tokenAccountFrom,
  tokenAccountTo,
  tokenId,
  tokenQty
) {
  const catContract = getCatContract(
    blockchainServerUrl,
    ownerPrivateKey,
    getCatContractDeployedAddressFromHardhat()
  );

  const data = "0x";
  await catContract.safeTransferFrom(
    tokenAccountFrom,
    tokenAccountTo,
    tokenId,
    tokenQty,
    data
  );
}

//function to burn token to an account
export async function burnableCatToken(blockchainServerUrl, ownerPrivateKey, tokenAccountTo, tokenId, tokenQty) {
  const catContract = getCatContract(
    blockchainServerUrl,
    ownerPrivateKey,
    getCatContractDeployedAddressFromHardhat()
  );

  try {
    await catContract.burn(tokenAccountTo, tokenId, tokenQty);
    
    
    console.log(`Successfully burned ${tokenQty} of token ID ${tokenId} from ${tokenAccountTo}`);
  } catch (error) {
    console.error("Error while burning token:", error);
  }
}

//function to add token from an account
export async function addToken(blockchainServerUrl,
  ownerPrivateKey,
  tokenAccountTo,
  tokenId,
  tokenQty) {
    const catContract = getCatContract(
      blockchainServerUrl,
      ownerPrivateKey,
      getCatContractDeployedAddressFromHardhat()
    );

  await catContract.mint(tokenAccountTo, tokenId, tokenQty);
}


