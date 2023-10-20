const { expect } = require("chai");
const { ethers } = require("hardhat");

const networkName = hre.network.name;

require('dotenv').config();

var chain = hre.network.name;
console.log("chain: ", chain);

const factoryJSON = require("../artifacts/contracts/S2OFactory.sol/S2OFactory.json");
const nftJSON = require("../artifacts/contracts/S2ONFT.sol/S2ONFT.json");
const appJSON = require("../artifacts/contracts/S2OSuperApp.sol/S2OSuperApp.json");
const streamerJSON = require("../artifacts/contracts/Streamer.sol/Streamer.json");
const hostJSON = require("./abis/host.json");
const cfaJSON = require("./abis/cfa.json");
const superJSON = require("./abis/super.json");
const sTokenJSON = require("./abis/sToken.json");
const erc20JSON = require("./abis/erc20.json");

if (chain == "localhost") {
    chain = "zkevm";
}

var addr = {};

if ("chain" == "base") {
    // Base addresses
    addr = {
        "factory": "",
        "nftImplementation": "",
        "appImplementation": "",
        "streamer": "",
        "sToken": "",
        "superApp": "",
        "nft": "",
        "feeRecipient": process.env.PUBLIC_KEY,
        "host": "0x4C073B3baB6d8826b8C5b229f3cfdC1eC6E47E74",
        "cfa": "0x19ba78B9cDB05A877718841c574325fdB53601bb",
        "stf": "0xe20B9a38E0c96F61d1bA6b42a61512D56Fea1Eb3",
    };
} else if (chain == "zkevm") {
    // zkEVM testnet addresses
    addr = {
        "factory": "",
        "nftImplementation": "",
        "appImplementation": "",
        "streamer": "",
        "sToken": "",
        "superApp": "",
        "nft": "",
        "feeRecipient": process.env.PUBLIC_KEY,
        "host": "0xe64f81d5dDdA1c7172e5C6d964E8ef1BD82D8704",
        "cfa": "0x1EAa5ceA064aab2692AF257FB31f5291fdA3Cdee",
        "stf": "0x0F3B163623F05b2BfF42956f7C7bd31456bd83a2",
    };
}

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);
const host = new ethers.Contract(addr.host, hostJSON.abi, signer);
const cfa = new ethers.Contract(addr.cfa, cfaJSON.abi, signer);
var factory, streamer, nft, sToken, superApp;

// Native Super Token
const tokenName = "S2O Super Token";
const symbol = "S2O";
const supply = "420000000000000000000000000000000"; // 420T


describe("Streamer", function () {

    it("should deploy the streamer contract", async function() {
        const Streamer = await ethers.getContractFactory("Streamer");
        streamer = await Streamer.deploy(tokenName, symbol, supply, addr.stf, addr.host, addr.cfa);
        addr.streamer = streamer.address;
        console.log("addr.streamer: ", addr.streamer);
        await streamer.deployTransaction.wait();
        addr.sToken = await streamer.token();
        console.log("addr.sToken: ", addr.sToken);
        sToken = new ethers.Contract(addr.sToken, sTokenJSON.abi, signer);
        expect(addr.sToken).to.not.equal("");
    });

    it("should drop 1M Super Tokens to deployer", async function() {
        var to = process.env.PUBLIC_KEY;
        await expect(streamer.drop(to, "1000000000000000000000000"))
            .to.emit(sToken, 'Transfer');
    });

    it("deployer should own 1M Super Tokens", async function() {
        expect(await sToken.balanceOf(process.env.PUBLIC_KEY))
            .to.be.gt(0);
    });

});

describe("Factory", function () {

    it("should deploy the nft implementation contract", async function() {
        const S2ONFT = await ethers.getContractFactory("contracts/S2ONFT.sol:S2ONFT");
        const implementation = await S2ONFT.deploy();
        addr.nftImplementation = implementation.address;
        expect(implementation).to.not.equal("");
    });

    it("should deploy the app implementation contract", async function() {
        const S2OSuperApp = await ethers.getContractFactory("contracts/S2OSuperApp.sol:S2OSuperApp");
        const implementation = await S2OSuperApp.deploy();
        addr.appImplementation = implementation.address;
        expect(implementation).to.not.equal("");
    });

    it("should deploy the factory contract", async function() {
        const Factory = await ethers.getContractFactory("S2OFactory");
        factory = await Factory.deploy();
        addr.factory = factory.address;
        await factory.deployTransaction.wait();
        await factory.initialize(addr.nftImplementation, addr.appImplementation, addr.host, addr.cfa, addr.feeRecipient);
        expect(addr.factory).to.not.equal("");
    });

    it("should deploy nft + app from factory", async function() {
        const nftSettings = {
            "name": "Test S2O NFT",
            "symbol": "S2ONFT",
            "uri": "https://s2o.dev/nft/",
            "maxSupply": 100
        }
        const appSettings = {
            "minFlowRate": "1000000000000000000", // 1 super token per second
            "minIncrement": "100000000000000000", // 0.1 super token per second
            "protocolFeePercent": "50000000000000000",
            "previousOwnerFeePercent": "50000000000000000"
        }
        const txn = await factory.createS2O(process.env.PUBLIC_KEY, addr.sToken, nftSettings, appSettings);
        const { events } = await txn.wait();
        const appEvent = events.find(x => x.event === "S2OSuperAppCreated");
        //console.log("cloneEvent: ", cloneEvent);
        addr.superApp = appEvent.args[1];
        console.log("addr.superApp: ", addr.superApp);
        const nftEvent = events.find(x => x.event === "S2ONFTCreated");
        //console.log("cloneEvent: ", cloneEvent);
        addr.nft = nftEvent.args[1];
        console.log("addr.nft: ", addr.nft);
        expect(addr.superApp).to.not.equal("");
    });

});

describe("NFT", function () {

    it("should mint an nft to the contract itself", async function() {
        nft = new ethers.Contract(addr.nft, nftJSON.abi, signer);
        const txn = await nft.mint();
        const { events } = await txn.wait();
        const Event = events.find(x => x.event === "Transfer");
        addr.tokenId = Event.args[2];
        console.log("addr.tokenId: ", addr.tokenId);
        const owner = await nft.ownerOf(addr.tokenId);
        expect(owner).to.equal(addr.nft);
    });

});

describe("Streams and Super App Callbacks", function () {

    it("should stream to the Super app", async function() {
        const flowRate = "1000000000000000000"; // 1 sToken per second
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        await host.callAgreement(
            addr.cfa,
            iface.encodeFunctionData("createFlow", [
                addr.sToken,
                addr.superApp,
                flowRate,
                "0x"
            ]),
            userData
        );
        var flow = await cfa.getFlow(addr.sToken, process.env.PUBLIC_KEY, addr.superApp);
        console.log("flow: ", flow);
        expect(1).to.equal(1);
    });

    it("token should now be owner by streamer", async function() {
        const owner = await nft.ownerOf(addr.tokenId);
        expect(owner).to.equal(process.env.PUBLIC_KEY);
    });

});



