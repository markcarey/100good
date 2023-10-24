// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;

// TODO: remove console.log later
import "hardhat/console.sol";

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

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777Upgradeable.sol";
import { IERC1820RegistryUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol";
import {ERC2771ContextUpgradeable} from "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";

interface S2ONFT {
    function exists(uint256 tokenId) external view returns (bool);
    function onStreamChange(address from, address to, uint256 tokenId) external;
}

contract S2OSuperApp is Initializable, IERC777RecipientUpgradeable, SuperAppBase, AccessControlUpgradeable, ERC2771ContextUpgradeable {
    using CFAv1Library for CFAv1Library.InitData;
    
    CFAv1Library.InitData public cfaV1;
    ISuperfluid _host;
    IConstantFlowAgreementV1 _cfa;
    ISuperToken private _acceptedToken;

    S2ONFT public nftContract;

    struct Settings {
        int96 minFlowRate;
        int96 minIncrement;
        int96 protocolFeePercent;
        int96 previousOwnerFeePercent;
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

    bytes32 public constant MANAGER = keccak256("MANAGER_ROLE");
   
    address admin;
    address public feeRecipient;
    int96 feeFlowRate;
    address beneficiary;
    int96 beneficiaryFlowRate;

    enum StreamTypes { NEW, REPLACE, UPDATE, DELETE }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC2771ContextUpgradeable(0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0d) {
       _disableInitializers();
    }

    function initialize(
        address _admin,
        address _beneficiary,
        address _feeRecipient,
        address _superToken,
        address host,
        address cfa,
        address _nftContract,
        Settings memory _settings
    ) public virtual initializer
    {
        __AccessControl_init_unchained();
        IERC1820RegistryUpgradeable _erc1820 = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        _erc1820.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));

        _host = ISuperfluid(host);
        _cfa = IConstantFlowAgreementV1(cfa);

        nftContract = S2ONFT(_nftContract);
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

    function incrementalFlowRate(int96 flowRate, int96 percent) internal pure returns (int96) {
        return int96(int256( uint256(uint96(flowRate)) * uint256(uint96(percent)) / 1 ether ));
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
        returns (bytes memory newCtx)
    {
        ////console.log("afterAgreementCreated");
        newCtx = _ctx;
        (address streamer,) = abi.decode(_agreementData, (address, address));
        require(streamer != feeRecipient, "SuperApp: feeRecipient cannot stream");
        ////console.log("streamer", streamer);
        //ISuperfluid.Context memory decompiledContext = _host.decodeCtx(_ctx);
        uint256 tokenId = abi.decode(_host.decodeCtx(_ctx).userData, (uint256));
        //console.log("tokenId", tokenId);
        // idea: mint if tokenId doesn't exist?
        require(nftContract.exists(tokenId), "SuperApp: token does not exist");
        (,int96 inFlowRate,,) = _cfa.getFlowByID(_acceptedToken, _agreementId);
        console.log("inFlowRate", uint256(uint96(inFlowRate)));
        bool deletePreviousFlow = false;
        if (tokenFlows[tokenId].owner == address(0)) {
            // new stream
            //console.log("settings.minFlowRate", uint256(uint96(settings.minFlowRate)));
            require(inFlowRate >= settings.minFlowRate, "SuperApp: flowRate below minimum");
            tokenFlows[tokenId].previousOwner = address(0);
        } else {
            // replacement stream
            require(inFlowRate >= (tokenFlows[tokenId].flowRate + settings.minIncrement), "SuperApp: flowRate below increment");
            // The following line has been commented out because it was cauing a APP_RULE_NO_CRITICAL_RECEIVER_ACCOUNT revert,
            // despite the fact that it would result in a netFlow == zero after the callback completes. For clarity,
            // the INCOMING flow being deleted in NOT the flow that triggered this onCreated callback
            //newCtx = cfaV1.deleteFlowWithCtx(newCtx, tokenFlows[tokenId].owner, address(this), _acceptedToken);
            deletePreviousFlow = true;
            if(tokenFlows[tokenId].previousOwner != address(0)) {
                (,int96 existingFlowRate,,) = cfaV1.cfa.getFlow(_acceptedToken, address(this), tokenFlows[tokenId].previousOwner);
                //console.log("existingFlowRate to previous owner address", uint256(uint96(existingFlowRate)));
                //console.log("previousOwnerFlowRate", uint256(uint96(existingFlowRate - incrementalFlowRate(tokenFlows[tokenId].flowRate, settings.previousOwnerFeePercent))));
                newCtx = cfaV1.flowWithCtx(newCtx, tokenFlows[tokenId].previousOwner, _acceptedToken, existingFlowRate - incrementalFlowRate(tokenFlows[tokenId].flowRate, settings.previousOwnerFeePercent));
            }
            tokenFlows[tokenId].previousOwner = tokenFlows[tokenId].owner;
        }
        int96 flowRateDelta = inFlowRate - tokenFlows[tokenId].flowRate;
        tokenFlows[tokenId].owner = streamer;
        tokenFlows[tokenId].flowRate = inFlowRate;
        tokenFlows[tokenId].lastUpdated = block.timestamp;
        tokenIds[streamer] = tokenId;
        //console.log("before onStreamChange");
        nftContract.onStreamChange(tokenFlows[tokenId].previousOwner == address(0) ? address(nftContract) : tokenFlows[tokenId].previousOwner, streamer, tokenId);
        //console.log("after onStreamChange");
        newCtx = _updateOutflows(newCtx, tokenId, flowRateDelta, tokenFlows[tokenId].previousOwner == address(0) ? StreamTypes.NEW : StreamTypes.REPLACE);
        if (deletePreviousFlow) {
            newCtx = cfaV1.deleteFlowWithCtx(newCtx, tokenFlows[tokenId].previousOwner, address(this), _acceptedToken);
        }
        ISuperfluid.Context memory sfContext = _host.decodeCtx(newCtx);
        uint256 remainingAppCredit = sfContext.appCreditGranted - uint256(sfContext.appCreditUsed);
        int96 maxRemainingFr = _cfa.getMaximumFlowRateFromDeposit(_acceptedToken, remainingAppCredit);
        console.log("AFTER DELETE: max remaining flow rate", uint256(uint96(maxRemainingFr)));
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
        returns (bytes memory newCtx)
    {
        newCtx = _ctx;
        (address streamer,) = abi.decode(_agreementData, (address, address));
        uint256 tokenId = tokenIds[streamer];
        (,int96 inFlowRate,,) = _cfa.getFlowByID(_acceptedToken, _agreementId);
        int96 flowRateDelta = inFlowRate - tokenFlows[tokenId].flowRate;
        //require(inFlowRate > tokenFlows[tokenId].flowRate, "SuperApp: can only increase flowRate");
        require(inFlowRate >= (tokenFlows[tokenId].flowRate + settings.minIncrement), "SuperApp: flowRate below increment");
        tokenFlows[tokenId].flowRate = inFlowRate;
        tokenFlows[tokenId].lastUpdated = block.timestamp;
        // @dev tokenId remains with streamer, no need to transfer NFT
        return _updateOutflows(newCtx, tokenId, flowRateDelta, StreamTypes.UPDATE);
    }
    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 ,//_agreementId,
        bytes calldata _agreementData,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        returns (bytes memory newCtx)
    {
        //console.log("afterAgreementTerminated");
        // According to the app basic law, we should never revert in a termination callback
        if ( !_isSameToken(_superToken) || !_isCFAv1(_agreementClass) || (msg.sender != address(_host)) ) return _ctx;
        newCtx = _ctx;
        (address streamer,) = abi.decode(_agreementData, (address, address));
        if (streamer == address(this)) {
            return _ctx;
        }
        uint256 tokenId = tokenIds[streamer];
        // TODO: transfer token back to nftContract
        nftContract.onStreamChange(streamer, address(nftContract), tokenId);
        return _updateOutflows(newCtx, tokenId, tokenFlows[tokenId].flowRate, StreamTypes.DELETE);
    }

    function _updateOutflows(
        bytes memory _ctx,
        uint256 tokenId,
        int96 flowRateDelta,
        StreamTypes streamType
    )
        private
        returns (bytes memory newCtx)
    {
        //console.log("_updateOutflows");
        newCtx = _ctx;
        // @dev incremental flowrates:
        //console.log("flowRateDelta", uint256(uint96(flowRateDelta)));
        //console.log("settings.protocolFeePercent", uint256(uint96(settings.protocolFeePercent)));
        int96 fee = int96(int256( uint256(uint96(flowRateDelta)) * uint256(uint96(settings.protocolFeePercent)) / 1 ether ));
        //console.log("fee", uint256(uint96(fee)));
        int96 previousOwnerFee = tokenFlows[tokenId].previousOwner == address(0) ? int96(0) : int96(int256( uint256(uint96(streamType == StreamTypes.UPDATE ? flowRateDelta: tokenFlows[tokenId].flowRate)) * uint256(uint96(settings.previousOwnerFeePercent)) / 1 ether ));
        if (tokenFlows[tokenId].previousOwner == beneficiary) {
            previousOwnerFee = 0;
        }
        //console.log("previousOwnerFee", uint256(uint96(previousOwnerFee)));
        int96 remainder = flowRateDelta - fee - previousOwnerFee;
        //console.log("remainder", uint256(uint96(remainder)));

        if (streamType == StreamTypes.DELETE) {
            fee = -fee;
            previousOwnerFee = -previousOwnerFee;
            remainder = -remainder;
        }
        feeFlowRate += fee;
        //console.log("feeFlowRate", uint256(uint96(feeFlowRate)));
        //console.logInt(feeFlowRate);
        newCtx = cfaV1.flowWithCtx(newCtx, feeRecipient, _acceptedToken, feeFlowRate);
        if ( (tokenFlows[tokenId].previousOwner != address(0)) && (previousOwnerFee != int96(0)) ) {
            (,int96 existingFlowRate,,) = cfaV1.cfa.getFlow(_acceptedToken, address(this), tokenFlows[tokenId].previousOwner);
            //console.log("existingFlowRate to previous owner address", uint256(uint96(existingFlowRate)));
            //console.log("previousOwnerFlowRate", uint256(uint96(existingFlowRate + previousOwnerFee)));
            newCtx = cfaV1.flowWithCtx(newCtx, tokenFlows[tokenId].previousOwner, _acceptedToken, existingFlowRate + previousOwnerFee);
        }
        beneficiaryFlowRate += remainder;
        //console.log("beneficiaryFlowRate", uint256(uint96(beneficiaryFlowRate)));
        newCtx = cfaV1.flowWithCtx(newCtx, beneficiary, _acceptedToken, beneficiaryFlowRate);
        //console.log("after beneficiary flow");
        if (streamType == StreamTypes.DELETE) {
            delete tokenFlows[tokenId];
        }
        ISuperfluid.Context memory sfContext = _host.decodeCtx(newCtx);
        uint256 remainingAppCredit = sfContext.appCreditGranted - uint256(sfContext.appCreditUsed);
        int96 maxRemainingFr = _cfa.getMaximumFlowRateFromDeposit(_acceptedToken, remainingAppCredit);
        console.log("BEFORE DELETE: max remaining flow rate", uint256(uint96(maxRemainingFr)));
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

    // The following functions are overrides required by Solidity.

    function _msgSender() internal view override(ERC2771ContextUpgradeable, ContextUpgradeable) returns (address) {
        return super._msgSender();
    }

    function _msgData() internal view override(ERC2771ContextUpgradeable, ContextUpgradeable) returns (bytes calldata) {
        return super._msgData();
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

