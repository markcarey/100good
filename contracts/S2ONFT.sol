// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import {ERC2771ContextUpgradeable} from "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
//import '@openzeppelin/contracts/utils/Strings.sol';


contract S2ONFT is Initializable, ERC721Upgradeable, AccessControlUpgradeable, OwnableUpgradeable, ERC2771ContextUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using SafeERC20 for IERC20;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant SUPERAPP_ROLE = keccak256("SUPERAPP_ROLE");
    CountersUpgradeable.Counter private _tokenIdCounter;

    struct Settings {
        uint256 maxSupply;
        uint256 minFlowRate;
        uint256 minIncrement;
        string baseURI;
    }
    Settings public settings;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC2771ContextUpgradeable(0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0d) {
       _disableInitializers();
    }

    function initialize(string calldata _name, string calldata _symbol, address _admin, address _owner, Settings _settings) initializer public {
        __ERC721_init(_name, _symbol);
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(SUPERAPP_ROLE, msg.sender);
        _transferOwnership(_owner);
        settings = _settings;
    }

    function _baseURI() internal view override returns (string memory) {
        return settings.baseURI;
    }

    function mint() public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < settings.maxSupply, "S2ONFT: max supply reached");
        _tokenIdCounter.increment();
        _safeMint(address(this), tokenId);
    }

    function onStreamChange(address from, address to, uint256 tokenId) public onlyRole(SUPERAPP_ROLE) {
        // TODO: check settings here?
        _transfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _msgSender() internal view override(ERC2771ContextUpgradeable, ContextUpgradeable) returns (address) {
        return super._msgSender();
    }

    function _msgData() internal view override(ERC2771ContextUpgradeable, ContextUpgradeable) returns (bytes calldata) {
        return super._msgData();
    }
}
