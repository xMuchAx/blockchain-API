pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";


// import "@openzeppelin/contracts/access/Ownable.sol";

// see https://docs.openzeppelin.com/contracts/5.x/erc1155
// or use the wizard https://docs.openzeppelin.com/contracts/5.x/wizard
contract CatERC1155 is ERC1155, Ownable, ERC1155Burnable {
    uint256 public constant CAT = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    // constructor(address initialOwner) ERC1155("https://cat.exemple.fr/token") Ownable(initialOwner) {}
    // ex of uri : "https://cat.exemple.fr/token/{id}"
    // constructor(string memory uri_) ERC1155(uri_) {
    //     _mint(msg.sender, GOLD, 1, "");
    //     _mint(msg.sender, SILVER, 2, "");
    //     _mint(msg.sender, THORS_HAMMER, 3, "");
    //     _mint(msg.sender, SWORD, 5, "");
    //     _mint(msg.sender, SHIELD, 8, "");
    // }

    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {
        _mint(msg.sender, CAT, 100, "");
        _mint(msg.sender, SILVER, 2, "");
        _mint(msg.sender, THORS_HAMMER, 3, "");
        _mint(msg.sender, SWORD, 5, "");
        _mint(msg.sender, SHIELD, 8, "");

    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount)
        public
        onlyOwner
    {
        _mint(account, id, amount, "0x");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // updatable uri
    // function setURI(string memory newuri) public onlyOwner {
    //     _setURI(newuri);
    // }
}