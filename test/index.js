const { expect } = require("chai");
const { ethers } = require("hardhat");

const networkName = hre.network.name;

require('dotenv').config();

const chain = hre.network.name;
console.log("chain: ", chain);

const factoryJSON = require("../artifacts/contracts/S2OFactory.sol/S2OFactory.json");
const nftJSON = require("../artifacts/contracts/S2ONFT.sol/S2ONFT.json");
const appJSON = require("../artifacts/contracts/S2OSuperApp.sol/S2OSuperApp.json");
const streamerJSON = require("../artifacts/contracts/Streamer.sol/Streamer.json");
const hostJSON = require("./abis/host.json");
const cfaJSON = require("./abis/cfa.json");
const superJSON = require("./abis/super.json");
const erc20JSON = require("./abis/erc20.json");

// Base addresses
var addr = {
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
    "USDbC": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    "USDbCx": "0x4dB26C973FaE52f43Bd96A8776C2bf1b0DC29556",
    "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "USDCx": "0xD04383398dD2426297da660F9CCA3d439AF9ce1b",
    "cbETH": "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    "WETH": "0x4200000000000000000000000000000000000006",
};

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
        sToken = new ethers.Contract(addr.sToken, sTokenABI, signer);
        expect(addr.sToken).to.not.equal("");
    });

    it("should drop 1M Super Tokens to deployer", async function() {
        var to = process.env.PUBLIC_KEY;
        await expect(streamer.drop(to, "1000000000000000000000000"))
            .to.emit(sToken, 'Transfer');
    });

});

describe("Factory", function () {

    it("should deploy the nft implementation contract", async function() {
        const S2ONFT = await ethers.getContractFactory("S2ONFT");
        const implementation = await S2ONFT.deploy();
        addr.nftImplementationmplementation = implementation.address;
        expect(implementation).to.not.equal("");
    });

    it("should deploy the app implementation contract", async function() {
        const S2OSuperApp = await ethers.getContractFactory("S2OSuperApp");
        const implementation = await S2OSuperApp.deploy();
        addr.appImplementation = implementation.address;
        expect(implementation).to.not.equal("");
    });

    it("should deploy the factory contract", async function() {
        const Factory = await ethers.getContractFactory("S2OFactory");
        factory = await Factory.deploy(addr.nftImplementation, addr.appImplementation, addr.host, addr.cfa, addr.feeRecipient);
        addr.factory = factory.address;
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


