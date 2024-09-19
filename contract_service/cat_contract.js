import {ethers} from "ethers";
import {readFileSync} from "fs";
import {dirname, join} from "path";
import {contract_adress} from "../API/index.js";
import {fileURLToPath} from 'url';

// Solution pour obtenir __dirname dans un module ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const abi_path = "./abi.json";

/////////////////////////////////////////////////////////////////////////////
// Helpers specific to the Cat contract
/////////////////////////////////////////////////////////////////////////////

export function getReadOnlyCatContract(blockchainServerUrl, catContractDeployedAddress) {
    const noNeedOfAccount = null;
    return getCatContract(blockchainServerUrl, noNeedOfAccount, catContractDeployedAddress);
}

function getCatContract(blockchainServerUrl, accountPrivateKey, catContractDeployedAddress) {
    const provider = new ethers.getDefaultProvider(blockchainServerUrl);
    let contractRunner = provider;

    if (accountPrivateKey !== null) {
        const wallet = new ethers.Wallet(accountPrivateKey);
        const connectedWallet = wallet.connect(provider);
        contractRunner = connectedWallet;
    }

    const catContractAbiJson = getCatContractAbiFromHardhat();
    const contract = new ethers.Contract(catContractDeployedAddress, catContractAbiJson, contractRunner);

    return contract;
}

export function getCatContractAbiFromHardhat() {
    const jsonFile = join(__dirname, abi_path);
    const compiled_contract = JSON.parse(readFileSync(jsonFile).toString());
    const abi_json = compiled_contract.abi;

    return abi_json;
}

export function getCatContractDeployedAddressFromHardhat() {
    return contract_adress;
}

/////////////////////////////////////////////////////////////////////////////
// Services provided by the Cat contract
/////////////////////////////////////////////////////////////////////////////

export async function getCatTokenQuantity(blockchainServerUrl, tokenAccount, tokenId) {
    const catContract = getReadOnlyCatContract(blockchainServerUrl, getCatContractDeployedAddressFromHardhat());
    const tokenQuantity = await catContract.balanceOf(tokenAccount, tokenId);
    return tokenQuantity;
}

export async function transferCatToken(blockchainServerUrl, ownerPrivateKey, tokenAccountFrom, tokenAccountTo, tokenId, tokenQty) {
    const catContract = getCatContract(blockchainServerUrl, ownerPrivateKey, getCatContractDeployedAddressFromHardhat());
    const data = "0x";
    await catContract.safeTransferFrom(tokenAccountFrom, tokenAccountTo, tokenId, tokenQty, data);
}

export async function burnableCatToken(blockchainServerUrl, ownerPrivateKey, tokenAccountTo, tokenId, tokenQty) {
    const catContract = getCatContract(blockchainServerUrl, ownerPrivateKey, getCatContractDeployedAddressFromHardhat());
    try {
        await catContract.burn(tokenAccountTo, tokenId, tokenQty);
        console.log(`Successfully burned ${tokenQty} of token ID ${tokenId} from ${tokenAccountTo}`);
    } catch (error) {
        console.error("Error while burning token:", error);
    }
}

export async function addCatToken(blockchainServerUrl, ownerPrivateKey, tokenAccountTo, tokenId, tokenQty) {
    const catContract = getCatContract(
        blockchainServerUrl,
        ownerPrivateKey,
        getCatContractDeployedAddressFromHardhat(
        ));
    await catContract.mint(tokenAccountTo, tokenId, tokenQty);
}