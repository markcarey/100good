// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import {ERC2771ContextUpgradeable} from "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
//import '@openzeppelin/contracts/utils/Strings.sol';

contract S2ONFT is Initializable, ERC721Upgradeable, IERC721Receiver, AccessControlUpgradeable, OwnableUpgradeable, ERC2771ContextUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant SUPERAPP_ROLE = keccak256("SUPERAPP_ROLE");
    CountersUpgradeable.Counter private _tokenIdCounter;
    string private baseURI;
    uint256 public maxSupply;

    struct Settings {
        string name;
        string symbol;
        string uri;
        uint256 maxSupply;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC2771ContextUpgradeable(0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0d) {
       _disableInitializers();
    }

    function initialize(address _admin, address _owner, Settings memory _settings) initializer public {
        __ERC721_init(_settings.name, _settings.symbol);
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _transferOwnership(_owner);
        baseURI = _settings.uri;
        maxSupply = _settings.maxSupply;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function mint() public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < maxSupply, "S2ONFT: max supply reached");
        _tokenIdCounter.increment();
        _safeMint(address(this), tokenId);
    }

    function onStreamChange(address from, address to, uint256 tokenId) public onlyRole(SUPERAPP_ROLE) {
        // TODO: check settings here, or in SuperApp code?
        _transfer(from, to, tokenId);
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
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
