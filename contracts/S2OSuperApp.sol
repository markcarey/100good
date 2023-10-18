// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.8.0;

import {
    ISuperfluid,
    ISuperToken,
    ISuperApp,
    ISuperAgreement,
    SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {
    SuperAppBase
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import {
    CFAv1Library
} from "./superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777Upgradeable.sol";
import { IERC1820RegistryUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol";

contract S2OSuperApp is IERC777RecipientUpgradeable, SuperAppBase, AccessControl {
    using SafeMath for uint256;
    using CFAv1Library for CFAv1Library.InitData;
    //using EnumerableSet for EnumerableSet.AddressSet;
    
    CFAv1Library.InitData public cfaV1;
    ISuperfluid _host;
    IConstantFlowAgreementV1 _cfa;
    ISuperToken private _acceptedToken;

    IERC721 public nftContract;

    struct Settings {
        uint256 maxSupply;
        int96 minFlowRate;
        int96 minIncrement;
        string baseURI;
    }
    Settings public settings;

    struct tokenFlow {
        int96 flowRate;
        uint256 lastUpdated;
        address owner;
        address previousOwner;
    }
    // tokenId => tokenFlow
    mapping(uint256 => tokenFlow) public tokenFlows;
   
    // streamer => tokenId 
    mapping(address => uint256) public tokenIds;

    // Mapping from streamer address to their (enumerable) set of token contracts where they have tokens
    //mapping (address => EnumerableSet.AddressSet) public streamerContracts;

    bytes32 public constant MANAGER = keccak256("MANAGER_ROLE");
   
    address admin;
    address public feeRecipient;
    int96 feeFlowRate;
    address beneficiary;
    int96 beneficiaryFlowRate;

    constructor (
        address _admin,
        address _beneficiary,
        address _feeRecipient,
        address _superToken,
        address host,
        address cfa,
        address _nftContract,
        Settings memory _settings
    )
    {

        IERC1820RegistryUpgradeable _erc1820 = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        _erc1820.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));

        _host = ISuperfluid(host);
        _cfa = IConstantFlowAgreementV1(cfa);

        nftContract = IERC721(_nftContract);
        admin = _admin;
        feeRecipient = _feeRecipient;
        beneficiary = _beneficiary;
        settings = _settings;

        //Access Control
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MANAGER, admin);

        // super token accepted for streams
        _acceptedToken = ISuperToken(_superToken);

        cfaV1 = CFAv1Library.InitData(
            _host,
            IConstantFlowAgreementV1(
                address(_host.getAgreementClass(
                        keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")
                    ))
                )
        );

        // TODO: register Super App?
        uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;
        _host.registerAppByFactory(ISuperApp(address(this)), configWord);

    }

    function acceptedToken() external view returns (address) {
        return address(_acceptedToken);
    }

    function setFeeRecipient(address _feeRecipient) external onlyRole(MANAGER) {
        feeRecipient = _feeRecipient;
    }

    
    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/
    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata _agreementData,
        bytes calldata ,// _cbdata,
        bytes calldata _ctx
    )
        external override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        onlyIfStreamsEnabled
        returns (bytes memory newCtx)
    {
        newCtx = _ctx;
        (address streamer,) = abi.decode(_agreementData, (address, address));
        ISuperfluid.Context memory decompiledContext = _host.decodeCtx(_ctx);
        uint256 tokenId = abi.decode(decompiledContext.userData, (uint256));
        (,int96 inFlowRate,,) = _cfa.getFlowByID(_acceptedToken, agreementId);
        if (tokenFlows[tokenId].owner == address(0)) {
            // new stream
            require(inFlowRate > settings.minFlowRate, "SuperApp: flowRate below minimum");
            tokenFlows[tokenId].previousOwner = address(0);
        } else {
            // replacement stream
            require(inFlowRate > (tokenFlows[tokenId].flowRate + settings.minIncrement), "SuperApp: flowRate below increment");
            newCtx = cfaV1.deleteFlowWithCtx(newCtx, tokenFlows[tokenId].owner, address(this), _acceptedToken);
            if(tokenFlows[tokenId].previousOwner != address(0)) {
                (,int96 existingFlowRate,,) = cfaV1.cfa.getFlow(_acceptedToken, address(this), tokenFlows[tokenId].previousOwner);
                newCtx = cfaV1.flowWithCtx(newCtx, tokenFlows[tokenId].previousOwner, _acceptedToken, existingFlowRate - tokenFlows[tokenId].flowRate);
            }
            tokenFlows[tokenId].previousOwner = tokenFlows[tokenId].owner;
        }
        tokenFlows[tokenId].owner = streamer;
        tokenFlows[tokenId].flowRate = inFlowRate;
        tokenFlows[tokenId].lastUpdated = block.timestamp;
        tokenIds[streamer] = tokenId;
        // TODO: transfer the NFT to the new owner
        return _updateOutflows(newCtx, tokenFlows[tokenId], false);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata _agreementData,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        onlyIfStreamsEnabled
        returns (bytes memory newCtx)
    {
        newCtx = _ctx;
        (address streamer,) = abi.decode(_agreementData, (address, address));
        uint256 tokenId = tokenIds[streamer];
        // TODO: check if tokern exists
        (,int96 inFlowRate,,) = _cfa.getFlowByID(_acceptedToken, agreementId);
        require(inFlowRate > tokenFlows[tokenId].flowRate, "SuperApp: can only increase flowRate");
        tokenFlows[tokenId].flowRate = inFlowRate;
        tokenFlows[tokenId].lastUpdated = block.timestamp;
        // @dev tokenId remains with streamer, no need to transfer NFT
        return _updateOutflows(newCtx, tokenFlows[tokenId], false);
    }
    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata _agreementData,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        returns (bytes memory newCtx)
    {
        // According to the app basic law, we should never revert in a termination callback
        if ( !_isSameToken(_superToken) || !_isCFAv1(_agreementClass) || (msg.sender != address(_host)) ) return _ctx;
        newCtx = _ctx;
        (address streamer,) = abi.decode(_agreementData, (address, address));
        uint256 tokenId = tokenIds[streamer];
        // TODO: transfer token back to nftContract

        return _updateOutflows(newCtx, tokenFlows[tokenId], true);
    }

    function _updateOutflows(
        bytes memory _ctx,
        tokenFlow memory _tokenFlow,
        bool _isTermination
    )
        private
        returns (bytes memory newCtx)
    {
        newCtx = _ctx;

        // @dev incremental flowrates:
        int96 fee = _tokenFlow.flowRate * settings.protocolFeePercent / 1 ether;
        int96 previousOwnerFee = _tokenFlow.flowRate * settings.previousOwnerFeePercent / 1 ether;
        int96 remainder = _tokenFlow.flowRate - fee - previousOwnerFee;

        if (_isTermination) {
            fee = -fee;
            previousOwnerFee = -previousOwnerFee;
            remainder = -remainder;
        }
        feeFlowRate += fee;
        newCtx = cfaV1.flowWithCtx(newCtx, feeRecipient, _acceptedToken, feeFlowRate);
        if (_tokenFlow.previousOwner != address(0)) {
            (,int96 existingFlowRate,,) = cfaV1.cfa.getFlow(_acceptedToken, address(this), tokenFlows[tokenId].previousOwner);
            newCtx = cfaV1.flowWithCtx(newCtx, _tokenFlow.previousOwner, _acceptedToken, existingFlowRate + previousOwnerFee);
        }
        beneficiaryFlowRate += remainder;
        newCtx = cfaV1.flowWithCtx(newCtx, beneficiary, _acceptedToken, beneficiaryFlowRate);
    }



    function getNetFlow() public view returns (int96) {
       return _cfa.getNetFlow(_acceptedToken, address(this));
    }
    function _isSameToken(ISuperToken superToken) private view returns (bool) {
        return address(superToken) == address(_acceptedToken);
    }
    function _isCFAv1(address agreementClass) private view returns (bool) {
        return ISuperAgreement(agreementClass).agreementType()
            == keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1");
    }
    modifier onlyHost() {
        require(msg.sender == address(_host), "SuperApp: support only one host");
        _;
    }
    modifier onlyExpected(ISuperToken superToken, address agreementClass) {
        require(_isSameToken(superToken), "SuperApp: not accepted token");
        require(_isCFAv1(agreementClass), "SuperApp: only CFAv1 supported");
        _;
    }

    function tokensReceived(
        address,
        address,
        address,
        uint256,
        bytes calldata,
        bytes calldata
    ) external override {
        // do nothing
    }

}

