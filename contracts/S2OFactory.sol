// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

interface S2ONFT {
    struct Settings {
        string name;
        string symbol;
        string uri;
        uint256 maxSupply;
    }
    function initialize(address _admin, address _owner, Settings memory _settings) external;
    function grantRole(bytes32 role, address account) external;
}
interface S2OSuperApp {
    struct Settings {
        int96 minFlowRate;
        int96 minIncrement;
        int96 protocolFeePercent;
        int96 previousOwnerFeePercent;
    }
    function initialize(address _admin, address _beneficiary, address _feeRecipient, address _superToken, address host, address cfa, address _nftContract, Settings memory _settings) external;
}

contract S2OFactory is Initializable, ERC2771Context {
    address public nftImplementation;
    address public superAppImplementation;
    address private host;
    address private cfa;
    address private feeRecipient;
    bytes32 public constant SUPERAPP_ROLE = keccak256("SUPERAPP_ROLE");

    constructor() ERC2771Context(0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0d) {
        //_disableInitializers();
    }

    function initialize(address _nftImplementation, address _superAppImplementation, address _host, address _cfa, address _feeRecipient) initializer public {
        nftImplementation = _nftImplementation;
        superAppImplementation = _superAppImplementation;
        host = _host;
        cfa = _cfa;
        feeRecipient = _feeRecipient;
    }

    event S2ONFTCreated(
        address indexed owner,
        address nftContract
    );

    event S2OSuperAppCreated(
        address indexed beneficiary,
        address superAppContract
    );

    // @dev deploys a S2O NFT + SuperApp contracts
    function createS2O(
        address owner, 
        address _superToken,
        S2ONFT.Settings memory _nftSettings,
        S2OSuperApp.Settings memory _settings
    ) external returns (address, address) {
        bytes32 salt = keccak256(abi.encode(_nftSettings.name, _nftSettings.symbol, owner));
        address nft = Clones.cloneDeterministic(nftImplementation, salt);
        S2ONFT(nft).initialize(_msgSender(), owner, _nftSettings);
        emit S2ONFTCreated(owner, nft);
        address superApp = Clones.cloneDeterministic(superAppImplementation, salt);
        S2OSuperApp(superApp).initialize(_msgSender(), owner, feeRecipient, _superToken, host, cfa, nft, _settings);
        emit S2OSuperAppCreated(owner, superApp);
        S2ONFT(nft).grantRole(SUPERAPP_ROLE, superApp);
        return (nft, superApp);
    }

}
