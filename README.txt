Hardhat is used to compile and deploy smart contracts
EtherJs is used to interact with the smart contracts

Install all package with :
npm install
 
edit hardhat.config.js to specify :
- the blockchain network you are going to connect to
- private keys of your accounts
Those accounts will be used to deploy the contract
The file account.js is used to all public/private key for testing 


To compile the smart contract. Do it at least once. Do it every time a smart contract in contracts/ changes
npx hardhat compile --force

Edit  blockchain_core/hardhat/ignition/modules/cat.cjs to put your own uri

To run the deployments :
npx hardhat ignition deploy blockchain_core/hardhat/ignition/modules/cat.js --network ganache --reset

After the deployment :
- the address of the deployed contract is in blockchain_core/hardhat/ignition/deployments/chain-1337/deployed_addresses.json
- the ABI of the contract is in blockchain_core/hardhat/artifacts/contracts/cat.sol/CatERC1155.json 

Directory organization :
blockchain_core/ : everything related to the blockchain (contract, deployment)

blockchain_core/contract_service/cat_contract.js : functions to help you interact with the deployed contract.

blockchain_core/hardhat/ : everything works in the Hardhat way
- all the contracts are stored in contracts/
- all the deployment script are stored in ignition/modules


To run the basic test :
node cat_simple.js


There is a skeleton express web app in server.js 