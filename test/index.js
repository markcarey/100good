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
    chain = "celo";
}

var mnid = require('mnid');
var mnidAddr = mnid.encode( {
    "network": "0xa4ec",
    "address": "0xb20DBcd49AE5BAd06E350De88b30639E36e753B9" // superApp Deployer
});
const params = {
    m: mnidAddr,
    a: '10000000000000000000',
    r: '100 Good',
    cat: 3,
    ven: {
      cbu: 'https://api.100good.xyz/api/funded',
      ind: '100-good',
      web: 'https://100good.xyz/',
      ven: '100 Good',
      d:'just testing',
    }
};
const gdCode = encodeURIComponent(btoa(JSON.stringify(params)));
//console.log("payment link: ", "https://wallet.gooddollar.org/?code=" + gdCode);
//return;

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
        "feeRecipient": "0x827a0F679D7CE70e7a0a6A1Ef2be473f1Cc8d7bb", // "feeRecipient"
        "host": "0x4C073B3baB6d8826b8C5b229f3cfdC1eC6E47E74",
        "cfa": "0x19ba78B9cDB05A877718841c574325fdB53601bb",
        "stf": "0xe20B9a38E0c96F61d1bA6b42a61512D56Fea1Eb3",
    };
} else if (chain == "zkevm") {
    // zkEVM testnet addresses
    addr = {
        "factory": "0x28C480abbe9399259dFd43DE2D0e037EDdF2234b",
        "nftImplementation": "0xA32Fcb91eaBbDea5f9Ed77706727d1D5a6B19fe1",
        "appImplementation": "0x191CFf9f634c219f6bb44b70b958e8Af806DeD10",
        "streamer": "0x94F4237016DCE85F31442D38126be72f928Cdf6f",
        "sToken": "0x23E6d1B7ddbF737293DDAF7c56E687A227520850",
        "superApp": "0x9170e2b356a9d39c531032e40e71a6b0DBfeDc88",
        "nft": "0x70e9D049403D43e1D6c2b34fF7dC94371F20eC91",
        "feeRecipient": "0x827a0F679D7CE70e7a0a6A1Ef2be473f1Cc8d7bb", // "feeRecipient"
        "host": "0xe64f81d5dDdA1c7172e5C6d964E8ef1BD82D8704",
        "cfa": "0x1EAa5ceA064aab2692AF257FB31f5291fdA3Cdee",
        "stf": "0x0F3B163623F05b2BfF42956f7C7bd31456bd83a2",
    };
} else if (chain == "celo") {
    // celo addresses
    addr = {
        "factory": "",
        "nftImplementation": "",
        "appImplementation": "",
        "streamer": "",
        "sToken": "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A", // G$
        "superApp": "",
        "nft": "",
        "feeRecipient": "0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1", // GoodDollar UBIScheme
        "host": "0xA4Ff07cF81C02CFD356184879D953970cA957585",
        "cfa": "0x9d369e78e1a682cE0F8d9aD849BeA4FE1c3bD3Ad",
        "stf": "0x36be86dEe6BC726Ed0Cbd170ccD2F21760BC73D9",
    };
}

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);
const signerOne = new ethers.Wallet(process.env.TR8_ONE_PRIV, ethers.provider);
const signerTwo = new ethers.Wallet(process.env.TR8_TWO_PRIV, ethers.provider);
const signerThree = new ethers.Wallet(process.env.TR8_THREE_PRIV, ethers.provider);
const host = new ethers.Contract(addr.host, hostJSON.abi, signer);
const cfa = new ethers.Contract(addr.cfa, cfaJSON.abi, signer);
var factory, streamer, nft, sToken, superApp;

// Native Super Token
const tokenName = "FISH Super Token";
const symbol = "FISH";
const supply = "420000000000000000000000000000000"; // 420T


describe("Streamer", function () {

    it.skip("should deploy the streamer contract", async function() {
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

    it.skip("should drop 1M Super Tokens to deployer", async function() {
        var to = process.env.PUBLIC_KEY;
        await expect(streamer.drop(to, "1000000000000000000000000"))
            .to.emit(sToken, 'Transfer');
    });

    it.skip("deployer should own 1M Super Tokens", async function() {
        expect(await sToken.balanceOf(process.env.PUBLIC_KEY))
            .to.be.gt(0);
    });

    it.skip("should drop 1M Super Tokens to signerOne", async function() {
        var to = await signerOne.getAddress();
        await expect(streamer.drop(to, "1000000000000000000000000"))
            .to.emit(sToken, 'Transfer');
    });

    it.skip("should drop 1M Super Tokens to signerTwo", async function() {
        var to = await signerTwo.getAddress();
        await expect(streamer.drop(to, "1000000000000000000000000"))
            .to.emit(sToken, 'Transfer');
    });

    it.skip("should drop 1M Super Tokens to signerThree", async function() {
        var to = await signerThree.getAddress();
        await expect(streamer.drop(to, "1000000000000000000000000"))
            .to.emit(sToken, 'Transfer');
    });

});

describe("Factory", function () {

    it("should deploy the nft implementation contract", async function() {
        const S2ONFT = await ethers.getContractFactory("contracts/S2ONFT.sol:S2ONFT");
        const implementation = await S2ONFT.deploy();
        addr.nftImplementation = implementation.address;
        console.log("addr.nftImplementation: ", addr.nftImplementation);
        console.log(`npx hardhat verify --network ${chain} ${addr.nftImplementation}`);
        expect(implementation).to.not.equal("");
    });

    it("should deploy the app implementation contract", async function() {
        const S2OSuperApp = await ethers.getContractFactory("contracts/S2OSuperApp.sol:S2OSuperApp");
        const implementation = await S2OSuperApp.deploy();
        addr.appImplementation = implementation.address;
        console.log("addr.appImplementation: ", addr.appImplementation);
        console.log(`npx hardhat verify --network ${chain} ${addr.appImplementation}`);
        expect(implementation).to.not.equal("");
    });

    it("should deploy the factory contract", async function() {
        const Factory = await ethers.getContractFactory("S2OFactory");
        factory = await Factory.deploy();
        addr.factory = factory.address;
        console.log("addr.factory: ", addr.factory);
        await factory.deployTransaction.wait();
        await factory.initialize(addr.nftImplementation, addr.appImplementation, addr.host, addr.cfa, addr.feeRecipient);
        console.log(`npx hardhat verify --network ${chain} ${factory.address}`);
        expect(addr.factory).to.not.equal("");
    });

    it.skip("should deploy nft + app from factory", async function() {
        this.timeout(240000);
        factory = new ethers.Contract(addr.factory, factoryJSON.abi, signer);
        const nftSettings = {
            "name": "Cats in Hats S2O",
            "symbol": "CAT",
            "uri": "https://api.catsinhats.art/meta/",
            "maxSupply": 100
        }
        const appSettings = {
            "minFlowRate": "1000000000000000000", // 1 super token per second
            "minIncrement": "100000000000000000", // 0.1 super token per second
            "protocolFeePercent": "50000000000000000",
            "previousOwnerFeePercent": "50000000000000000"
        }
        const txn = await factory.connect(signerOne).createS2O(await signerOne.getAddress(), addr.sToken, nftSettings, appSettings);
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

describe.skip("NFT", function () {

    it("should mint an nft to the contract itself", async function() {
        nft = new ethers.Contract(addr.nft, nftJSON.abi, signerOne);
        const txn = await nft.mint();
        const { events } = await txn.wait();
        const Event = events.find(x => x.event === "Transfer");
        addr.tokenId = Event.args[2];
        console.log("addr.tokenId: ", addr.tokenId);
        const owner = await nft.ownerOf(addr.tokenId);
        expect(owner).to.equal(addr.nft);
    });

});

describe.skip("Streams and Super App Callbacks", function () {

    const preDeposit = "3700000000000000000000"; // 60*60 sToken

    it.skip("should drop 3600 Super Tokens to the super app", async function() {
        var to = addr.superApp;
        await expect(streamer.drop(to, preDeposit))
            .to.emit(sToken, 'Transfer');
    });

    it.skip("superApp shown own 3600 Super Tokens", async function() {
        var balance = await sToken.balanceOf(addr.superApp);
        expect(balance).to.equal(preDeposit);
    });

    it("should REVERT trying to stream to the Super app omitting userdata", async function() {
        const flowRate = "1000000000000000000"; // 1 sToken per second
        addr.tokenId = "0";
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        try {
            await host.callAgreement(
                addr.cfa,
                iface.encodeFunctionData("createFlow", [
                    addr.sToken,
                    addr.superApp,
                    flowRate,
                    "0x"
                ]),
                "0x"
            );
        } catch (e) {
        
        }
        var flow = await cfa.getFlow(addr.sToken, process.env.PUBLIC_KEY, addr.superApp);
        console.log("flow: ", flow);
        expect(flow.flowRate).to.equal(0); // stream should fail because not userData
    });

    it("should stream to the Super app", async function() {
        const flowRate = "1000000000000000000"; // 1 sToken per second
        addr.tokenId = "0";
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        await host.connect(signerOne).callAgreement(
            addr.cfa,
            iface.encodeFunctionData("createFlow", [
                addr.sToken,
                addr.superApp,
                flowRate,
                "0x"
            ]),
            userData
        );
        var flow = await cfa.getFlow(addr.sToken, await signerOne.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        expect(flow.flowRate).to.be.gt(0);
    });

    it("token should now be owner by streamer", async function() {
        const owner = await nft.ownerOf(addr.tokenId);
        expect(owner).to.equal(await signerOne.getAddress());
    });

    it("should now be a stream from the Super app to feeRecipient", async function() {
        var flow = await cfa.getFlow(addr.sToken, addr.superApp, addr.feeRecipient);
        console.log("flow: ", flow);
        expect(flow.flowRate).to.be.gt(0);
    });

    it("should now be a stream from the Super app to beneficiary", async function() {
        var flow = await cfa.getFlow(addr.sToken, addr.superApp, await signerOne.getAddress());
        console.log("flow: ", flow);
        expect(flow.flowRate).to.be.gt(0);
    });

    it.skip("should increase stream to the Super app", async function() {
        const flowRate = "2000000000000000000"; // 2 sToken per second
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        await host.connect(signerOne).callAgreement(
            addr.cfa,
            iface.encodeFunctionData("updateFlow", [
                addr.sToken,
                addr.superApp,
                flowRate,
                "0x"
            ]),
            userData
        );
        var flow = await cfa.getFlow(addr.sToken, await signerOne.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        expect(flow.flowRate).to.be.gt(0);
    });

    it.skip("should revert due to stream increment too low", async function() {
        const flowRate = "2050000000000000000"; // 2.05 sToken per second
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        try {
            await host.connect(signerTwo).callAgreement(
                addr.cfa,
                iface.encodeFunctionData("createFlow", [
                    addr.sToken,
                    addr.superApp,
                    flowRate,
                    "0x"
                ]),
                userData
            );
        } catch (e) {}
        var flow = await cfa.getFlow(addr.sToken, await signerTwo.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        expect(flow.flowRate).to.equal(0); // stream should fail because increment too low
    });

    it("should stream to takeover an existing token with active stream", async function() {
        // first let some time pass:
        let MONTH = 60 * 60 * 24 * 30;
        await hre.network.provider.request({
            method: "evm_increaseTime",
            params: [MONTH]
        });
        await hre.network.provider.send("evm_mine");

        const flowRate = "3000000000000000000"; // 3 sToken per second
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        try {
            await host.connect(signerTwo).callAgreement(
                addr.cfa,
                iface.encodeFunctionData("createFlow", [
                    addr.sToken,
                    addr.superApp,
                    flowRate,
                    "0x"
                ]),
                userData
            );
        } catch (e) {}
        var flow = await cfa.getFlow(addr.sToken, await signerTwo.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        const netFlow = await cfa.getNetFlow(addr.sToken, addr.superApp);
        console.log("netFlow: ", netFlow);
        expect(flow.flowRate).to.be.gt(0);
    });

    it.skip("should STOP stream from signerOne", async function() {
        // half an hour
        await hre.network.provider.request({
            method: "evm_increaseTime",
            params: [60*30*4]
        });
        await hre.network.provider.send("evm_mine");

        const superApp = new ethers.Contract(addr.superApp, appJSON.abi, signer);
        const senderBalBefore = await sToken.balanceOf(await signer.getAddress());
        const steamerBalBefore = await sToken.balanceOf(await signerOne.getAddress());
        await superApp.stopStream(await signerOne.getAddress());
        const senderBalAfter = await sToken.balanceOf(await signer.getAddress());
        const steamerBalAfter = await sToken.balanceOf(await signerOne.getAddress());
        console.log("senderBalBefore: ", senderBalBefore.toString());
        console.log("senderBalAfter: ", senderBalAfter.toString());
        console.log("steamerBalBefore: ", steamerBalBefore.toString());
        console.log("steamerBalAfter: ", steamerBalAfter.toString());
        var flow = await cfa.getFlow(addr.sToken, await signerOne.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        expect(flow.flowRate).to.equal(0);
    });

    it("token should now be owned by the NEW streamer", async function() {
        const owner = await nft.ownerOf(addr.tokenId);
        expect(owner).to.equal(await signerTwo.getAddress());
    });

    it("should stream from signerThree to takeover an existing token with active stream", async function() {
        const flowRate = "4000000000000000000"; // 4 sToken per second
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        try {
            await host.connect(signerThree).callAgreement(
                addr.cfa,
                iface.encodeFunctionData("createFlow", [
                    addr.sToken,
                    addr.superApp,
                    flowRate,
                    "0x"
                ]),
                userData
            );
        } catch (e) {}
        var flow = await cfa.getFlow(addr.sToken, await signerThree.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        const netFlow = await cfa.getNetFlow(addr.sToken, addr.superApp);
        console.log("netFlow: ", netFlow);
        expect(flow.flowRate).to.be.gt(0);
    });

    it("token should now be owned by the NEW streamer", async function() {
        const owner = await nft.ownerOf(addr.tokenId);
        expect(owner).to.equal(await signerThree.getAddress());
    });

    it("should be a stream to previous owner of token which should be signerTwo", async function() {
        var flow = await cfa.getFlow(addr.sToken, addr.superApp, await signerTwo.getAddress() );
        console.log("flow: ", flow);
        expect(flow.flowRate).to.be.gt(0);
    });

    it("should STOP stream from signerThree", async function() {
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        try {
            await host.connect(signerThree).callAgreement(
                addr.cfa,
                iface.encodeFunctionData("deleteFlow", [
                    addr.sToken,
                    await signerThree.getAddress(),
                    addr.superApp,
                    "0x"
                ]),
                userData
            );
        } catch (e) {}
        var flow = await cfa.getFlow(addr.sToken, await signerThree.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        const netFlow = await cfa.getNetFlow(addr.sToken, addr.superApp);
        console.log("netFlow: ", netFlow);
        expect(flow.flowRate).to.equal(0);
    });

    it("token should now be owned by the nft CONTRACT", async function() {
        const owner = await nft.ownerOf(addr.tokenId);
        expect(owner).to.equal(addr.nft);
    });

    it("should STOP stream from signerOne who no longer owns token", async function() {
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        try {
            await host.connect(signerOne).callAgreement(
                addr.cfa,
                iface.encodeFunctionData("deleteFlow", [
                    addr.sToken,
                    await signerOne.getAddress(),
                    addr.superApp,
                    "0x"
                ]),
                userData
            );
        } catch (e) {}
        var flow = await cfa.getFlow(addr.sToken, await signerOne.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        const netFlow = await cfa.getNetFlow(addr.sToken, addr.superApp);
        console.log("netFlow: ", netFlow);
        expect(flow.flowRate).to.equal(0);
    });

    it("should STOP stream from signerTwo who no longer owns token", async function() {
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(addr.tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        try {
            await host.connect(signerTwo).callAgreement(
                addr.cfa,
                iface.encodeFunctionData("deleteFlow", [
                    addr.sToken,
                    await signerTwo.getAddress(),
                    addr.superApp,
                    "0x"
                ]),
                userData
            );
        } catch (e) {}
        var flow = await cfa.getFlow(addr.sToken, await signerTwo.getAddress(), addr.superApp);
        console.log("flow: ", flow);
        const netFlow = await cfa.getNetFlow(addr.sToken, addr.superApp);
        console.log("netFlow: ", netFlow);
        expect(flow.flowRate).to.equal(0);
    });

});



