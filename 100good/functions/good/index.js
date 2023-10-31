var firebase = require('firebase-admin');
if (!firebase.apps.length) {
    firebase.initializeApp();
}
var storage = firebase.storage();
const bucket = storage.bucket("100good");
var db = firebase.firestore();

const express = require("express");
const api = express();
const jose = require('jose');
var mnid = require('mnid');

const { ethers } = require("ethers");

const nftJSON = require(__base + 'good/abis/S2ONFT.json');
const factoryJSON = require(__base + 'good/abis/S2OFactory.json');
const appJSON = require(__base + 'good/abis/S2OSuperApp.json');
const cfaJSON = require(__base + 'good/abis/cfa.json');
const hostJSON = require(__base + 'good/abis/host.json');
const sTokenJSON = require(__base + 'good/abis/sToken.json');

const safeCoreSDK = require('@safe-global/safe-core-sdk');
const Safe = safeCoreSDK.default;
const SafeFactory = safeCoreSDK.SafeFactory;
const safeEthersLib = require('@safe-global/safe-ethers-lib');
const EthersAdapter = safeEthersLib.default;

const fetch = require('node-fetch');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const defaultChainId = 42220; // Celo

var provider = new ethers.providers.JsonRpcProvider({"url": process.env.API_URL_CELO});
var providers = [];
providers[5] = new ethers.providers.JsonRpcProvider({"url": process.env.API_URL_GOERLI});
providers[420] = new ethers.providers.JsonRpcProvider({"url": process.env.API_URL_OPTIGOERLI});
providers[421613] = new ethers.providers.JsonRpcProvider({"url": process.env.API_URL_ARBIGOERLI});
providers[42220] = new ethers.providers.JsonRpcProvider({"url": process.env.API_URL_CELO});
var signer;

var chainNames = [];
chainNames[5] = "ethereum-2";
chainNames[420] = "optimism";
chainNames[421613] = "arbitrum";
chainNames[42220] = "celo";

var openSeaSlugs = [];
openSeaSlugs[5] = "goerli";
openSeaSlugs[420] = "optimism-goerli";
openSeaSlugs[421613] = "arbitrum-goerli";
openSeaSlugs[42220] = "celo";

var ensProvider = new ethers.providers.JsonRpcProvider({"url": "https://" + process.env.RPC_ETH});

const jwksSocial = 'https://api.openlogin.com/jwks';
const jwksExternal = 'https://authjs.web3auth.io/jwks';
const maxInt = ethers.constants.MaxUint256;

const ONE_PER_DAY = "11574074074074"; // flowRate per second for 1 G$ daily (18 decimals)

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

function getContracts(pk, provider) {
    signer = new ethers.Wallet(pk, provider);
}

function abbrAddress(address){
    return address.slice(0,4) + "..." + address.slice(address.length - 4);
}

function fixAvatar(url) {
    var newUrl;
    // Twitter example: https://pbs.twimg.com/profile_images/1601225833741418497/PhQp9CL4_normal.jpg
    if ( url.includes('twimg') ) {
        newUrl = url.replace('_normal.', '.');
    }
    // Google example: https://lh3.googleusercontent.com/a/AGNmyxYJ3wOecX7hcroDs6W7KotI6mvTV5qM8Zlzdn0ObQ=s96-c
    if ( url.includes('googleusercontent') ) {
        newUrl = url.replace('=s96-c', '=s256-c');
    }
    // Discord: https://cdn.discord.com/avatars/822180265753444412/71df2273e2c42cf1ce797223999f1510.png?size=2048
    if ( url.includes('cdn.discord.com') ) {
        newUrl = url.replace('discord.com', 'discordapp.com');
        newUrl = newUrl.replace('?size', '?nosize');
    }
    return newUrl ? newUrl : url;
}

async function getENS(address){
    return new Promise(async function(resolve) {
        var name = await ensProvider.lookupAddress(address);
        if (name) {
            resolve(name);
        } else {
            resolve('');
        }
    });
}

async function getSafeAddress(address, deploy) {
    return new Promise(async (resolve, reject) => {
        const signer = new ethers.Wallet(process.env.GOOD_HOT_PRIV, provider);
        const ethAdapter = new EthersAdapter({
            "ethers": ethers,
            "signerOrProvider": signer
        });
        const safeFactory = await SafeFactory.create({ "ethAdapter": ethAdapter });
        var owners = [
            address, 
            await signer.getAddress(), 
            process.env.GOOD_COLD
        ];
        console.log(owners);
        const threshold = 1;
        const safeAccountConfig = {
            "owners": owners,
            "threshold": threshold,
            "fallbackHandler": process.env.FALLBACK_HANDLER_ADDR_CELO
        };
        const safeDeploymentConfig = {
            "saltNonce": address
        }
        var safeAddress;
        if (deploy) {
            //var predictedAddress = await safeFactory.predictSafeAddress({ safeAccountConfig, safeDeploymentConfig });
            const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, safeDeploymentConfig });
            safeAddress = safeSdk.getAddress();
            //console.log("pred/dep", predictedAddress, safeAddress);
        } else {
            safeAddress = await safeFactory.predictSafeAddress({ safeAccountConfig, safeDeploymentConfig });
        }
        resolve(safeAddress);
    });
}

async function deployS2O(safeAddress, settings) {
    return new Promise(async (resolve, reject) => {
        const signer = new ethers.Wallet(process.env.GOOD_HOT_PRIV, provider);
        const ethAdapter = new EthersAdapter({
            "ethers": ethers,
            "signerOrProvider": signer
        });
        const safeSDK = await Safe.create({ "ethAdapter": ethAdapter, "safeAddress": safeAddress });

        const factory = new ethers.Contract(process.env.S2O_FACTORY_ADDR, factoryJSON.abi, signer);
        const nftSettings = {
            "name": settings.name,
            "symbol": settings.symbol,
            "uri": "https://api.100good.xyz/meta/",
            "maxSupply": 100
        };
        const appSettings = {
            "minFlowRate": ONE_PER_DAY, // 1 token per day
            "minIncrement": ONE_PER_DAY, // 1 token per day
            "protocolFeePercent": "50000000000000000", // 5%
            "previousOwnerFeePercent": "50000000000000000" // 5%
        };
        const deployTxn = await factory.populateTransaction.createS2O(safeAddress, process.env.GOOD_DOLLAR_ADDR, nftSettings, appSettings);
        console.log("factoryData", deployTxn.data);

        const metaTransactionData = [
            {
                "to": process.env.S2O_FACTORY_ADDR,
                "data": deployTxn.data,
                "value": 0
            }
        ];
        const safeTransaction = await safeSDK.createTransaction({ "safeTransactionData": metaTransactionData });
        const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);
        console.log("signedSafeTransaction", JSON.stringify(signedSafeTransaction));
        const executeTxResponse = await safeSDK.executeTransaction(signedSafeTransaction);
        console.log("executeTxResponse", JSON.stringify(executeTxResponse));
        const receipt = await executeTxResponse.transactionResponse.wait();
        resolve(receipt);
    });
}

async function mintDirect(nftAddress) {
    return new Promise(async (resolve, reject) => {
        const signer = new ethers.Wallet(process.env.GOOD_HOT_PRIV, provider);
        const nft = new ethers.Contract(nftAddress, nftJSON.abi, signer);
        const txn = await nft.mint();
        const { events } = await txn.wait();
        const Event = events.find(x => x.event === "Transfer");
        addr.tokenId = Event.args[2];
        resolve(tokenId);
    });
}

async function mint(safeAddress, nftAddress) {
    return new Promise(async (resolve, reject) => {
        const signer = new ethers.Wallet(process.env.GOOD_HOT_PRIV, provider);
        const ethAdapter = new EthersAdapter({
            "ethers": ethers,
            "signerOrProvider": signer
        });
        const safeSDK = await Safe.create({ "ethAdapter": ethAdapter, "safeAddress": safeAddress });

        const nft = new ethers.Contract(nftAddress, nftJSON.abi, signer);
        const mintTxn = await nft.populateTransaction.mint();
        console.log("mintData", mintTxn.data);

        const metaTransactionData = [
            {
                "to": nftAddress,
                "data": mintTxn.data,
                "value": 0
            }
        ];
        const safeTransaction = await safeSDK.createTransaction({ "safeTransactionData": metaTransactionData });
        const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);
        console.log("signedSafeTransaction", JSON.stringify(signedSafeTransaction));
        const executeTxResponse = await safeSDK.executeTransaction(signedSafeTransaction);
        console.log("executeTxResponse", JSON.stringify(executeTxResponse));
        const receipt = await executeTxResponse.transactionResponse.wait();
        resolve(receipt);
    });
}

async function startStream(safeAddress, superAppAddress, tokenId, flowRate) {
    return new Promise(async (resolve, reject) => {
        const signer = new ethers.Wallet(process.env.GOOD_HOT_PRIV, provider);
        const ethAdapter = new EthersAdapter({
            "ethers": ethers,
            "signerOrProvider": signer
        });
        const safeSDK = await Safe.create({ "ethAdapter": ethAdapter, "safeAddress": safeAddress });

        // 1. Prefund 1G$
        const good = new ethers.Contract(process.env.GOOD_DOLLAR_ADDR, sTokenJSON.abi, signer);
        const tranferTxn = await good.populateTransaction.transfer(superAppAddress, "1000000000000000000"); // 1 G$ = 1e18 wei
        console.log("transferData", tranferTxn.data);

        const host = new ethers.Contract(process.env.HOST_ADDR, hostJSON.abi, signer);
        const cfa = new ethers.Contract(process.env.CFA_ADDR, cfaJSON.abi, signer);
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        const streamTxn = await host.populateTransaction.callAgreement(
            process.env.CFA_ADDR,
            iface.encodeFunctionData("createFlow", [
                process.env.GOOD_DOLLAR_ADDR,
                superAppAddress,
                flowRate,
                "0x"
            ]),
            userData
        );
        console.log("streamData", streamTxn.data);

        const metaTransactionData = [
            {
                "to": process.env.GOOD_DOLLAR_ADDR,
                "data": tranferTxn.data,
                "value": 0
            },
            {
                "to": process.env.HOST_ADDR,
                "data": streamTxn.data,
                "value": 0
            }
        ];
        const safeTransaction = await safeSDK.createTransaction({ "safeTransactionData": metaTransactionData });
        const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);
        console.log("signedSafeTransaction", JSON.stringify(signedSafeTransaction));
        const executeTxResponse = await safeSDK.executeTransaction(signedSafeTransaction);
        console.log("executeTxResponse", JSON.stringify(executeTxResponse));
        const receipt = await executeTxResponse.transactionResponse.wait();
        resolve(receipt);
    });
}

async function stopStream(safeAddress, superAppAddress, tokenId) {
    return new Promise(async (resolve, reject) => {
        const signer = new ethers.Wallet(process.env.GOOD_HOT_PRIV, provider);
        const ethAdapter = new EthersAdapter({
            "ethers": ethers,
            "signerOrProvider": signer
        });
        const safeSDK = await Safe.create({ "ethAdapter": ethAdapter, "safeAddress": safeAddress });

        const host = new ethers.Contract(process.env.HOST_ADDR, hostJSON.abi, signer);
        const cfa = new ethers.Contract(process.env.CFA_ADDR, cfaJSON.abi, signer);
        const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(tokenId)]);
        console.log("userData: ", userData);
        let iface = new ethers.utils.Interface(cfaJSON.abi);
        const streamTxn = await host.populateTransaction.callAgreement(
            process.env.CFA_ADDR,
            iface.encodeFunctionData("deleteFlow", [
                process.env.GOOD_DOLLAR_ADDR,
                safeAddress,
                superAppAddress,
                "0x"
            ]),
            userData
        );
        console.log("streamData", streamTxn.data);

        const metaTransactionData = [
            {
                "to": process.env.HOST_ADDR,
                "data": streamTxn.data,
                "value": 0
            }
        ];
        const safeTransaction = await safeSDK.createTransaction({ "safeTransactionData": metaTransactionData });
        const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);
        console.log("signedSafeTransaction", JSON.stringify(signedSafeTransaction));
        const executeTxResponse = await safeSDK.executeTransaction(signedSafeTransaction);
        console.log("executeTxResponse", JSON.stringify(executeTxResponse));
        resolve(executeTxResponse);
    });
}

async function getBalances(user) {
    return new Promise(async (resolve, reject) => {
        var balances = {};
        const balanceAbi = ["function balanceOf(address owner) view returns (uint256)"];
        const good = new ethers.Contract(process.env.GOOD_DOLLAR_ADDR, balanceAbi, provider);
        const goodBal = await good.balanceOf(user.safeAddress);
        balances["good"] = goodBal.toString();
        balances[process.env.GOOD_DOLLAR_ADDR] = goodBal.toString();
        await db.collection('users').doc(user.address).collection("wallet").doc("balances").set(balances);
        resolve(balances);
    });
}

function getFundingLink(safeAddress) {
    var mnidAddr = mnid.encode( {
        "network": "0xa4ec",
        "address": safeAddress
    });
    const params = {
        m: mnidAddr,
        a: '100000000000000000000', // 100 G$
        r: '100 Good',
        cat: 3,
        ven: {
        cbu: 'https://api.100good.xyz/api/funded',
        ind: '100-good',
        web: 'https://100good.xyz/',
        ven: '100 Good',
        d:'100good',
        }
    };
    const gdCode = encodeURIComponent(btoa(JSON.stringify(params)));
    const link = "https://wallet.gooddollar.org/?code=" + gdCode;
    return link;
}


async function generate(prompt, id) {
    return new Promise(async (resolve, reject) => {
      const aiResponse = await openai.createImage({
        "prompt": prompt,
        "n": 1,
        "size": '512x512' // TODO: increase for PRO users
      });
      const result = await fetch(aiResponse.data.data[0].url);
  
      // 2. Save image to storage bucket
      const readStream = result.body;
      const writeStream = bucket.file(`${id}.png`).createWriteStream();
      readStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('finish', () => resolve(true));
      readStream.pipe(writeStream);
    });
}

function getParams(req, res, next) {
    var params;
    if (req.method === 'POST') {
      params = req.body;
    } else {
      params = req.query;
    }
    req.q = params;
    next();
}

function cors(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET, POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      return res.status(204).send('');
    } else {
      // Set CORS headers for the main request
      res.set('Access-Control-Allow-Origin', '*');
    }
    next();
}

async function getAuth(req, res, next) {
    req.user = null;
    var idToken = null;
    var social = false;
    var socialHeader = req.header("X-web3Auth-Social");
    if (socialHeader == "true") {
        social = true;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      //console.log('Found "Authorization" header');
      // Read the API key from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      //console.log(req.q);
      if ("idToken" in req.q) {
        idToken = req.q.idToken;  // TODO: disableidToken in url params for production?
      }
    } // if req.headers
    if (idToken) {
        var jwksUrl = '';
        console.log("social", social);
        if (social) {
            jwksUrl = jwksSocial;
        } else {
            jwksUrl = jwksExternal;
        }
        //console.log("jwksUrl", jwksUrl);
        const jwks = jose.createRemoteJWKSet(new URL(jwksUrl));
        //console.log("jwks", jwks);
        const jwtDecoded = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });
        const payload = jwtDecoded.payload;
        var address;
        if ("address" in payload.wallets[0]) {
            address = payload.wallets[0].address;
        } else {
            const compKey = payload.wallets[0].public_key;
            address = ethers.utils.computeAddress(`0x${compKey}`);
            address = address.toLowerCase();
            payload.wallets[0].address = address;
        }
        const userRef = db.collection('users').doc(address);
        const user = await userRef.get();
        if (user.exists) {
            //return res.json(user.data());
            req.user = user.data();
        } else {
            var data = {
                "address": address
            };
            if ("email" in payload) {
                // TODO: for now, commented out for security reasons, but better to move to private subcollection, etc.
                //data.email = payload.email;   
            }
            if ("name" in payload) {
                data.name = payload.name;
            }
            if ("profileImage" in payload) {
                data.profileImage = fixAvatar(payload.profileImage);
            }
            var safeAddress = await getSafeAddress(address, false);
            //console.log("safeAddress", safeAddress);
            if (safeAddress) {
                data.safeAddress = safeAddress;
                data.safeDeployed = false;
                data.fundlink = getFundingLink(safeAddress);
            }
            data.needApprovals = false;
            data.plan = "free";
            data.postCount = 0;
            data.nftCount = 0;
            data.followerCount = 0;
            data.followingCount = 0;
            await db.collection('users').doc(address).set(data);
            await db.collection('users').doc(address).collection("wallet").doc("balances").set({"good": "0"});
            req.user = data;
        }
        if ("safeAddress" in req.user) {
            const link = getFundingLink(req.user.safeAddress);
            req.user.fundlink = link;
        }
    }
    next();
}
  
api.use(cors);
api.use(getParams);

api.get("/api", async function (req, res) {
    return res.json({"what": "100good", "why": "tbd"});
});

api.post("/api/funded", async function (req, res) {
    // goodDollar payment link callback
    console.log("POST /api/funded");
    console.log("req.body", JSON.stringify(req.body));
    console.log("req.q.invoiceId", req.q.invoiceId);
    console.log("req.q.transactionId", req.q.transactionId);
    return res.json({"what": "100good", "why": "tbd"});
});

api.get("/api/fundlink", getAuth, async function (req, res) {
    console.log("GET /api/fundlink");
    if (req.user == null) {
        return res.json({"error": "no user"});  
    }
    console.log("req.user", JSON.stringify(req.user));
    if ("safeAddress" in req.user) {
        const safeAddress = req.user.safeAddress;
        if (!safeAddress) {
            return res.json({"error": "no safeAddress"});
        }
        const link = getFundingLink(safeAddress);
        console.log("payment link: ", link);
        
        return res.json({"link": link, "safeAddress": safeAddress});
    } else {
        return res.json({"error": "no safeAddress"});
    }
});

api.post("/api/join", getAuth, async function (req, res) {
    console.log("req.user", JSON.stringify(req.user));

    // 1. Deploy Safe
    if (req.user.safeDeployed) {
        // already deployed
    } else {
        // deploy safe
        const safeAddress = await getSafeAddress(req.user.address, true);
        console.log("safeAddress", safeAddress);
    }

    // 2. Deploy S2O App + NFT contracts
    var nftAddress, appAddress;
    if ("nftAddress" in req.user) {
        nftAddress = req.user.nftAddress;
        appAddress = req.user.appAddress;
    }
    console.log("nftAddress", nftAddress);
    console.log("appAddress", appAddress);
    if (appAddress === undefined) {
        console.log("deploying S2O because appAddress is undefined");
        var settings = {};
        settings.name = req.q.name;
        settings.symbol = req.q.symbol;
        const factoryTxn = await deployS2O(req.user.safeAddress, settings);
        console.log("factoryTxn", factoryTxn);
        const factory = new ethers.Contract(process.env.S2O_FACTORY_ADDR, factoryJSON.abi, provider);
        for (let i = 0; i < factoryTxn.logs.length; i++) {
            const log = factoryTxn.logs[i];
            if (log.address.toLowerCase() == process.env.S2O_FACTORY_ADDR.toLowerCase()) {
                const event = factory.interface.parseLog(log);
                console.log("event", JSON.stringify(event));
                if (event.name == "S2OSuperAppCreated") {
                    appAddress = event.args.superAppContract;
                    console.log("appAddress", appAddress);
                }
                if (event.name == "S2ONFTCreated") {
                    nftAddress = event.args.nftContract;
                    console.log("nftAddress", nftAddress);
                }
            }
        }
    }

    // 3. Mint NFT
    var tokenId = 0;
    const nft = new ethers.Contract(nftAddress, nftJSON.abi, provider);
    const exists = await nft.exists(tokenId);
    if (!exists) {
        const mintTxn = await mint(req.user.safeAddress, nftAddress);
        console.log("mintTxn", mintTxn);
        for (let i = 0; i < mintTxn.logs.length; i++) {
            const log = mintTxn.logs[i];
            if (log.address.toLowerCase() == nftAddress.toLowerCase()) {
                const event = nft.interface.parseLog(log);
                console.log("event", JSON.stringify(event));
                if (event.name == "Transfer") {
                    tokenId = event.args.tokenId;
                }
            }
        }
    }
    console.log("tokenId", tokenId);

    // 4. Start Stream
    const flowRate = ONE_PER_DAY;
    console.log(req.user.safeAddress, appAddress, tokenId, flowRate);
    const streamTxn = await startStream(req.user.safeAddress, appAddress, tokenId, flowRate);
    console.log("streamTxn", streamTxn);

    var updates = {
        "prompt": req.q.prompt,
        "safeDeployed": true,
        "nftAddress": nftAddress,
        "appAddress": appAddress
    };
    console.log("updates", JSON.stringify(updates));
    await db.collection('users').doc(req.user.address).update(updates);


    // 5. NFT data
    var data = {};
    data.title = req.q.name + ' #' + tokenId;
    data.prompt = req.q.prompt;
    data.user = req.user.address;
    data.name = req.user.name ? req.user.name: '';
    data.profileImage = req.user.profileImage ? req.user.profileImage : '';
    data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    data.minted = true;
    data.minterAddress = req.user.address;
    data.tokenId = parseInt(tokenId);
    data.commentCount = 0;
    data.likeCount = 0;
    data.repostCount = 0;
    console.log("nft data", JSON.stringify(data));
    const doc = await db.collection('posts').add(data);
    await generate(data.prompt, doc.id);
    data.id = doc.id;
    await db.collection('users').doc(req.user.address).update({
        postCount: firebase.firestore.FieldValue.increment(1),
        nftCount: firebase.firestore.FieldValue.increment(1)
    });
    return res.json(data);
});

api.post("/api/post", getAuth, async function (req, res) {
    console.log("req.user", JSON.stringify(req.user));
    var data = {};
    data.title = req.q.title;
    data.prompt = req.q.prompt;
    data.category = req.q.category;
    data.price = req.q.price;
    data.currency = req.q.currency;
    data.type = req.q.type;
    data.selfmint = req.q.selfmint;
    data.mintable = req.q.mintable;
    data.mintChain = req.user.chain ? req.user.chain : defaultChainId;
    if ("mintchain" in req.q) {
        data.mintChain = req.q.mintchain;
    }
    data.mintChain = parseInt(data.mintChain);
    data.user = req.user.address;
    data.name = req.user.name ? req.user.name: '';
    data.profileImage = req.user.profileImage ? req.user.profileImage : '';
    data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    data.minted = false;
    data.commentCount = 0;
    data.likeCount = 0;
    data.repostCount = 0;
    console.log("art data", JSON.stringify(data));
    const doc = await db.collection('posts').add(data);
    await generate(data.prompt, doc.id);
    data.id = doc.id;
    await db.collection('users').doc(req.user.address).update({
        postCount: firebase.firestore.FieldValue.increment(1)
    });
    return res.json(data);
});

api.post("/api/comment", getAuth, async function (req, res) {
    console.log("req.user", JSON.stringify(req.user));
    var data = {};
    data.user = req.user.address;
    data.name = req.user.name ? req.user.name: '';
    data.profileImage = req.user.profileImage ? req.user.profileImage : '';
    data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    data.comment = req.q.comment;
    const doc = await db.collection('posts').doc(req.q.id).collection("comments").add(data);
    data.postId = req.q.id;
    data.id = doc.id;
    await db.collection('posts').doc(req.q.id).update({
        "commentCount": firebase.firestore.FieldValue.increment(1),
        "reactionCount": firebase.firestore.FieldValue.increment(1)
    });
    return res.json(data);
});

api.post("/api/like", getAuth, async function (req, res) {
    console.log("req.user", JSON.stringify(req.user));
    var data = {};
    data.user = req.user.address;
    data.name = req.user.name ? req.user.name: '';
    data.profileImage = req.user.profileImage ? req.user.profileImage : '';
    data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const doc = await db.collection('posts').doc(req.q.id).collection("likes").add(data);
    await db.collection('posts').doc(req.q.id).update({
        "likeCount": firebase.firestore.FieldValue.increment(1),
        "reactionCount": firebase.firestore.FieldValue.increment(1)
    });
    return res.json(data);
});

api.post("/api/follow", getAuth, async function (req, res) {
    console.log("req.user", JSON.stringify(req.user));
    const follower = req.user.address;
    const followed = req.q.address;
    if (follower == followed) {
        return res.json({"error": "cannot follow yourself"});
    }
    const followedUserDoc = await db.collection('users').doc(followed).get();  
    if (!followedUserDoc.exists) {
        return res.json({"error": "user not found"});
    }
    const followedUser = followedUserDoc.data();
    const nftAddress = followedUser.nftAddress;
    const superAppAddress = followedUser.appAddress;

    // first mint NFT
    var tokenId;
    const mintTxn = await mint(followedUser.safeAddress, nftAddress);
    const nft = new ethers.Contract(nftAddress, nftJSON.abi, provider);
    console.log("mintTxn", mintTxn);
    for (let i = 0; i < mintTxn.logs.length; i++) {
        const log = mintTxn.logs[i];
        if (log.address.toLowerCase() == nftAddress.toLowerCase()) {
            const event = nft.interface.parseLog(log);
            console.log("event", JSON.stringify(event));
            if (event.name == "Transfer") {
                tokenId = event.args.tokenId;
            }
        }
    }

    // then start stream
    const flowRate = ONE_PER_DAY;
    console.log(req.user.safeAddress, superAppAddress, tokenId, flowRate);
    const streamTxn = await startStream(req.user.safeAddress, superAppAddress, tokenId, flowRate);
    console.log("streamTxn", streamTxn);

    var data = {};
    data.title = await nft.name() + ' #' + parseInt(tokenId);
    data.prompt = followedUser.prompt;
    data.user = followedUser.address;
    data.name = followedUser.name ? followedUser.name: '';
    data.profileImage = followedUser.profileImage ? followedUser.profileImage : '';
    data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    data.minted = true;
    data.minterAddress = req.user.address;
    data.tokenId = parseInt(tokenId);
    data.commentCount = 0;
    data.likeCount = 0;
    data.repostCount = 0;
    console.log("nft data", JSON.stringify(data));
    const doc = await db.collection('posts').add(data);
    await generate(data.prompt, doc.id);
    data.id = doc.id;
    await db.collection('users').doc(req.user.address).update({
        postCount: firebase.firestore.FieldValue.increment(1),
        nftCount: firebase.firestore.FieldValue.increment(1)
    });

    await db.collection('users').doc(follower).update({
        following: firebase.firestore.FieldValue.arrayUnion(followed),
        followingCount: firebase.firestore.FieldValue.increment(1)
    });
    await db.collection('users').doc(followed).update({
        followers: firebase.firestore.FieldValue.arrayUnion(follower),
        followerCount: firebase.firestore.FieldValue.increment(1)
    });
    return res.json({"result": "ok"});
});

api.post("/api/repost", getAuth, async function (req, res) {
    console.log("req.user", JSON.stringify(req.user));
    var parentId = req.q.parent;
    const docRef = db.collection('posts').doc(parentId);
    const doc = await docRef.get();
    if (doc.exists) {
        const parent = doc.data();
        var data = {};
        data.parentId = parentId;
        data.title = parent.title;
        data.prompt = parent.prompt;
        data.category = parent.category;
        data.price = 1;
        data.currency = process.env.PAINT_ADDR;
        data.type = parent.type;
        data.selfmint = false;
        data.mintable = false;
        data.user = req.user.address;
        data.name = req.user.name ? req.user.name: '';
        data.profileImage = req.user.profileImage ? req.user.profileImage : '';
        data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
        data.minted = false;
        data.commentCount = 0;
        data.likeCount = 0;
        data.repostCount = 0;
        console.log("art data", JSON.stringify(data));
        const newDoc = await db.collection('posts').add(data);
        await generate(data.prompt, newDoc.id);
        data.id = newDoc.id;
        await db.collection('users').doc(req.user.address).update({
            "postCount": firebase.firestore.FieldValue.increment(1)
        });
        await docRef.update({
            "repostCount": firebase.firestore.FieldValue.increment(1),
            "reactionCount": firebase.firestore.FieldValue.increment(1)
        });
        await docRef.collection("reposts").add({
            "postId": data.id,
            "user": req.user.address,
            "name": req.user.name ? req.user.name: '',
            "profileImage": req.user.profileImage ? req.user.profileImage : '',
            "timestamp": firebase.firestore.FieldValue.serverTimestamp()
        });
        return res.json(data);
    } else {
        return res.json({"result": "error", "error": "parent post not found"});
    }
});

api.get("/api/profile", getAuth, async function (req, res) {
    // logged in user profile
    console.log("req.user", JSON.stringify(req.user));
    return res.json(req.user);
});
api.get("/api/profile/:address", async function (req, res) {
    const userRef = db.collection('users').doc(req.params.address);
    const user = await userRef.get();
    if (user.exists) {
        return res.json(user.data());
    } else {
        return res.json({"error": "user not found"});
    }
});
api.post("/api/profile", getAuth, async function (req, res) {
    const data = {
        "name": req.q.name,
        "profileImage": req.q.profileImage,
        "about": req.q.about,
        "location": req.q.location
    }
    await db.collection('users').doc(req.user.address).update(data);
    return res.json({"result": "ok", "message": "Profile data saved"});
});

api.post("/api/nftsettings", getAuth, async function (req, res) {
    const data = {
        "chain": parseInt(req.q.userchain),
    }
    await db.collection('users').doc(req.user.address).update(data);
    return res.json({"result": "ok", "message": "NFT settings saved"});
});

api.get("/api/balances", getAuth, async function (req, res) {
    // logged in user profile + balances
    console.log("req.user", JSON.stringify(req.user));
    const user = req.user;
    const balances = await getBalances(user);
    user.balances = balances;
    var cache = 'public, max-age=120, s-maxage=240';
    cache = 'public, max-age=1, s-maxage=2'; // TODO: adjust or remove this!!
    res.set('Cache-Control', cache);
    return res.json(user);
});

api.post("/api/stream", getAuth, async function (req, res) {
    const user = req.user;
    const balances = await getBalances(user);
    var id = req.q.id;
    const docRef = db.collection('posts').doc(id);
    const postDoc = await docRef.get();
    if (postDoc.exists) {
        const post = postDoc.data();
        post.id = postDoc.id;
        const tokenId = post.tokenId;
        const userRef = db.collection('users').doc(post.user);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const user = userDoc.data();
            const safeAddress = req.user.safeAddress;
            const appAddress = user.appAddress;
            // TODO: check current flowrate to better calc how much to add
            // For now, 2 G$ per day
            var amount = ethers.BigNumber.from(ONE_PER_DAY).add(ethers.BigNumber.from(ONE_PER_DAY));
            const streamTxn = await startStream(safeAddress, appAddress, tokenId, amount.toString());
            console.log("streamTxn", streamTxn);
            // TODO: confirm the stream and NFT transfer succeeded
            await postDoc.ref.update({
                "minterAddress": req.user.address
            });
            return res.json({"result": "ok", "message": "Stream started"});
        }
    }
});

api.post("/api/mint", getAuth, async function (req, res) {
    const user = req.user;
    const balances = await getBalances(user);
    var id = req.q.id;
    var chain = req.q.chain ? req.q.chain : defaultChainId;
    chain = parseInt(chain);
    const docRef = db.collection('posts').doc(id);
    const postDoc = await docRef.get();
    if (postDoc.exists) {
        const post = postDoc.data();
        post.id = postDoc.id;
        if (user.safeDeployed == false) { 
            // this a "first mint" for the minter, let the trigger handle this one
            await postDoc.ref.update({
                "minterAddress": user.address,
            });
            return res.json({
                "result": "ok",
                "message": "First Mint starting soon"
            });
        }
        var price = post.price;
        var currency = post.currency;
        if (currency == "0") {
            currency = process.env.PAINT_ADDR;
        }
        // 1. check if post can be minted by loggedin user
        var allowed = false;
        if (post.mintable) {
            allowed = true;
        } else {
            if (user.address.toLowerCase() == post.user.toLowerCase()) {
                // loggedin user is creator, they can mint for 1 pAInt
                allowed = true;
                price = 1;
                currency = process.env.PAINT_ADDR;
            }
        }
        if (post.minted) {
            // already minted
            allowed = false;
        }
        console.log("allowed to mint", allowed);

        // 2. Does user have enough balance to mint?
        const priceInWei = ethers.utils.parseUnits(price.toString(), "ether");
        console.log("balance and price", balances[currency], priceInWei);
        if ( ethers.BigNumber.from(balances[currency]).gte(priceInWei) ) {
            // balance is enough
            // get creator's Safe address first so they can receive payment
            var creatorSafeAddress;
            var nftAddress = process.env.AIRTIST_ADDR;
            const creatorRef = db.collection('users').doc(post.user);
            const creatorDoc = await creatorRef.get();
            if (creatorDoc.exists) {
                var creator = creatorDoc.data();
                creatorSafeAddress = creator.safeAddress;
                if ("nftContract" in creator) {
                    nftAddress = creator.nftContract;
                }
            } else {
                console.log(`user ${post.user} not found`);
                creatorSafeAddress = process.env.GOOD_HOT_PRIV; // default / fallback
            }
            // 3. prepare mint txn
            // Generate the target payload
            console.log("nftAddress", nftAddress);
            const signer = new ethers.Wallet(process.env.GOOD_HOT_PRIV, provider);
            const nft = new ethers.Contract(nftAddress, nftJSON.abi, signer);
            if (nftAddress != process.env.AIRTIST_ADDR) {
                // check approval for this PRO contract
                await doApprovals(user.safeAddress, nftAddress);
            }
            var mintTxn; 
            if (user.address.toLowerCase() == post.user.toLowerCase()) {
                mintTxn = await nft.populateTransaction.selfMint(user.safeAddress);
            } else {
                mintTxn = await nft.populateTransaction.publicMint(creatorSafeAddress, user.safeAddress, priceInWei, currency);
            }
            console.log(mintTxn.data);
            const network = await provider.getNetwork();
            const request = {
                "chainId": network.chainId,
                "target": nftAddress,
                "data": mintTxn.data,
                "user": await signer.getAddress()
            };
            console.log("request", request);
            const relayResponse = await relay.sponsoredCallERC2771(
                request,
                signer,
                process.env.GELATO_API_KEY
            );
            console.log(relayResponse, JSON.stringify(relayResponse));
            if ("taskId" in relayResponse) {
                await postDoc.ref.update({
                    "mintStatus": "pending",
                    "mintTaskId": relayResponse.taskId,
                    "minterAddress": user.address,
                    "nftContract": nftAddress.toLowerCase(),
                    "chain": defaultChainId,
                    "mintChain": parseInt(chain)
                });
                const notificationDoc = await db.collection('users').doc(user.address).collection('notifications').add({
                    "image": `https://api.airtist.xyz/images/${post.id}.png`,
                    "link": `https://airtist.xyz/p/${post.id}`,
                    "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
                    "text": `Minting has started for `,
                    "textLink": post.title ? post.title : "this post"
                });
                return res.json({
                    "result": "ok", 
                    "message": "Minting is underway",
                    "relay": relayResponse
                });
            } else {
                console.log("error: relay error", JSON.stringify(relayResponse));
                return res.json({
                    "result": "error", 
                    "error": "Minting relay error",
                    "relay": relayResponse
                });
            }
        } else {
            return res.json({"result": "error", "error": "insufficient funds", "balances": balances});
        }

    } else {
        return res.json({"result": "error", "error": "post not found"});
    }
}); 

api.get('/images/:id.png', async function (req, res) {
    console.log("start /images/ with path", req.path);
    const id = req.params.id;
    var cache = 'public, max-age=86400, s-maxage=864000';
  
    // Step 1: Fetch Image
    //console.log("path", req.path);
    var file;
  
    try {
      file = await bucket.file(`${id}.png`).download();
      //console.log(file);
    }
    catch (e) {
      console.log(`image: did not find image for ${req.path} for id ${id}`);
      //return res.json({"result": "catch: no file yet"});
    }
  
    if (!file) {
      return res.json({"result": "no file yet"});
    }
  
    const img = file[0];
    res.set('Cache-Control', cache);
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    return res.end(img);
}); // image

api.get('/meta/:nftAddress/:id', async function (req, res) {
    console.log("start /meta/ with path", req.path);
    const nftAddress = req.params.nftAddress;
    const tokenId = req.params.id;
    console.log("nftAddress and tokenId", nftAddress, tokenId);
    console.log("tokenId+1", tokenId + 1);
    console.log("parseInt + 1", parseInt(tokenId) + 1);
    var cache = 'public, max-age=3600, s-maxage=86400';
    cache = 'public, max-age=1, s-maxage=2'; // TODO: change this back to 1 hour

    var meta;
  
    return db.collection("posts").where("nftContract", "==", nftAddress).where("tokenId", "==", parseInt(tokenId))
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                const postID = doc.id;
                meta = {};
                meta.name = post.title ? post.title : `100Good #${tokenId}`; 
                meta.description = post.prompt;
                meta.external_url = `https://100good.xyz/p/${postID}`;
                meta.image = `https://api.100good.xyz/images/${postID}.png`;
                meta.attributes = [
                    {
                        "trait_type": "Creator",
                        "value": post.user
                    }
                ];
                if ("name" in post) {
                    meta.attributes.push(
                        {
                            "trait_type": "Creator Name",
                            "value": post.name
                        }

                    );
                }
            });
            console.log("meta", JSON.stringify(meta));
            if (!meta) {
                return res.json({"error": "metadata not found"});
            }
            res.set('Cache-Control', cache);
            return res.json(meta); 
        });   
}); // meta

api.post("/api/login", async function (req, res) {
    var idToken = req.q.idToken;
    //console.log("idToken", idToken);
    // TODO: get JWT from POST body or Bearer header
    //idToken =  'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIswkImtpZCI6IlRZT2dnXy01RU9FYmxhWS1WVlJZcVZhREFncHRuZktWNDUzNU1aUEMwdzAifQ.eyJpYXQiOjE2NzkzMjM4MDUsImF1ZCI6IkJQay0zWXpRRS02UjNIMFdaY21FQWVpb3lPUlc1eHlHUWJvN09SdUVERWlxWm9EcXpXZVRRTm9iamt0OEctTHpJd0hhMWZwY1ItdmphSkZQSnZTRXpqTSIsIm5vbmNlIjoiMDMwNzM1ZjhmN2IzY2ZhZWQzYWIxYjQxODlhM2U1ZTI0ZmQwMzBmNGNjNTBiNzliYmE0MTNiYjE3NjViMThkZDAxIiwiaXNzIjoiaHR0cHM6Ly9hcGkub3BlbmxvZ2luLmNvbSIsIndhbGxldHMiOlt7InB1YmxpY19rZXkiOiIwMmI1YzdkNTNkYmQ0MTRlYzk4N2M0YzlhODU3ZTgxMTNkNjNhMTliZDdmMjYzMGY2MWU3YWQzYWI0OTlkMDExZDEiLCJ0eXBlIjoid2ViM2F1dGhfYXBwX2tleSIsImN1cnZlIjoic2VjcDI1NmsxIn1dLCJlbWFpbCI6Im1hcmtAbWFya2NhcmV5LmNvbSIsIm5hbWUiOiJNYXJrIENhcmV5IiwicHJvZmlsZUltYWdlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WkxwMnE2YVZaWHBaSl9lT2hRVDNGSXFXR3JFNmVOWnNURDlJenY9czk2LWMiLCJ2ZXJpZmllciI6InRvcnVzIiwidmVyaWZpZXJJZCI6Im1hcmtAbWFya2NhcmV5LmNvbSIsImFnZ3JlZ2F0ZVZlcmlmaWVyIjoidGtleS1nb29nbGUtY3lhbiIsImV4cCI6MTY3OTQxMDIwNX0.yg-_rjHHiNB0wvld4cJwHPoSfoMuHeQOHrWMIN-9pQ8oIHeHIFC5AdqIVu1lhepNQ2PSle4_VqhjHiG0YlUyuA';
    //console.log("idToken", idToken);
    const pub_key = req.q.address;
    console.log(pub_key);
    var jwksUrl = '';
    const isSocial = req.q.social;
    console.log("isSocial", isSocial);
    if (isSocial) {
        jwksUrl = jwksSocial;
    } else {
        jwksUrl = jwksExternal;
    }
    const jwks = jose.createRemoteJWKSet(new URL(jwksUrl));
    //console.log("jwks", jwks);
    const jwtDecoded = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });
    const payload = jwtDecoded.payload;
    var address;
    if ("address" in payload.wallets[0]) {
        address = payload.wallets[0].address;
    } else {
        const compKey = payload.wallets[0].public_key;
        address = ethers.utils.computeAddress(`0x${compKey}`);
        payload.wallets[0].address = address;
    }
    // TODO:
    // create user in DB
    const userRef = db.collection('users').doc(address);
    const user = await userRef.get();
    if (user.exists) {
        return res.json(user.data());
    }
    var data = {
        "address": address
    };
    if ("email" in payload) {
        data.email = payload.email;
    }
    if ("name" in payload) {
        data.name = payload.name;
    }
    if ("profileImage" in payload) {
        data.profileImage = payload.profileImage;
    }
    var safeAddress = await getSafeAddress(address, false);
    console.log("safeAddress", safeAddress);
    if (safeAddress) {
        data.safeAddress = safeAddress;
        data.safeDeployed = false;
    }
    await db.collection('users').doc(address).set(data);
    // deploy Safe, or wait until later?
    return res.json(data);
});

module.exports.api = api;

module.exports.newUser = async function(snap, context) {
    const user = snap.data();
    const address = user.address;
    if (!address) {
      return;
    }
    var ens = await getENS(address);
    if (ens) {
        const userRef = snap.ref;
        await userRef.update({
            "name": ens
        });
    }
    return;
} // newUser

module.exports.newOrUpdatedPost = async function(change, context) {
    var postBefore = {};
    var isNew = false;
    if ( change.before.exists ) {
        postBefore = change.before.data();
    } else {
        isNew = true;
    }
    if ( !change.after.exists ) {
        // deleted post
        return;
    }
    const postDoc = change.after;
    const post = change.after.data();
    //const post = postDoc.data();
    var minterAddress = "";
    post.id = postDoc.id;
    var mintIt = false;
    if (isNew && post.selfmint) {
        mintIt = true;
        minterAddress = post.user;
    } else if ( "minterAddress" in post ) {
        if ( "minterAddress" in postBefore ) {
            mintIt = false;
        } else {
            mintIt = true;
            minterAddress = post.minterAddress;
        }
    }
    console.log("mintIt is " + mintIt, JSON.stringify(post));
    if ("tokenId" in post) {
        mintIt = false; // just to make extra sure, TODO: adjust this when open edition feature is added
    }
    var firstMint = false;
    if (mintIt) {
        //const postDoc = snap.ref;
        console.log('needs minting');
        const userDoc = await db.collection('users').doc(minterAddress).get();

        if (userDoc.exists) {
            const user = userDoc.data();  // "user" below refers to the minting user, who may or may not be the post creator
            // check if user has deployed their own NFT contract
            var creator;
            if (minterAddress != post.user) {
                // the minter is not the creator
                const creatorDoc = await db.collection('users').doc(post.user).get();
                creator = creatorDoc.data();
            } else {
                creator = user;
            }
            var nftAddress = creator.nftContract ? creator.nftContract : process.env.AIRTIST_ADDR;
            const signer = new ethers.Wallet(process.env.GOOD_HOT_PRIV, provider);
            var doApprovalsNow = false;
            if (user.safeDeployed == false) {
                firstMint = true;
                // first, deploy the safe
                const safeAddress = await getSafeAddress(user.address, true);
                if (safeAddress != user.safeAddress) {
                    console.log(`address of deployed safe (${safeAddress}) does not match predicted address (${user.safeAddress}) for user ${user.address}`);
                }
                // update user doc
                await userDoc.ref.update({
                    "safeDeployed": true,
                });
                doApprovalsNow = true;
            } // if safe deployed

            if (doApprovalsNow) {
                // TODO: actually check contract for current allowance?
                await doApprovals(user.safeAddress, nftAddress);
                // update user doc
                await userDoc.ref.update({
                    "needApprovals": false
                });
            }

            const network = await provider.getNetwork();
            const abi = [
                "function selfMint(address to)",
                "function publicMint(address creator, address to, uint256 amount, address currency)"
            ];
            const nft = new ethers.Contract(nftAddress, abi, signer);
            console.log("user.safeAddress", user.safeAddress);
            if (firstMint) {
                //const utils = require("@safe-global/relay-kit/utils");
                //utils.getUserNonce()
                const nonce = await getGelatoNonce(await signer.getAddress());
                console.log("nonce", nonce);
                // 1. relay mint for FREE
                // Generate the target payload
                const mintTxn = await nft.populateTransaction.publicMint(creator.safeAddress, user.safeAddress, "0", process.env.PAINT_ADDR);
                console.log(mintTxn.data);
                const request = {
                    "chainId": network.chainId,
                    "target": nftAddress,
                    "data": mintTxn.data,
                    "user": await signer.getAddress()
                };
                console.log("request", request);
                const relayResponse = await relay.sponsoredCallERC2771(
                    request,
                    signer,
                    process.env.GELATO_API_KEY
                );
                console.log(relayResponse, JSON.stringify(relayResponse));
                if ("taskId" in relayResponse) {
                    await postDoc.ref.update({
                        "mintStatus": "pending",
                        "mintTaskId": relayResponse.taskId,
                        "nftContract": nftAddress.toLowerCase(),
                        "chain": defaultChainId
                    });
                    const notificationDoc = await db.collection('users').doc(minterAddress).collection('notifications').add({
                        "image": `https://api.airtist.xyz/images/${post.id}.png`,
                        "link": `https://airtist.xyz/p/${post.id}`,
                        "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
                        "text": `Minting has started for `,
                        "textLink": post.title ? post.title : "this post"
                    });
                } else {
                    console.log("error: relay error", JSON.stringify(relayResponse));
                }

                // 2. drop 4 pAINnt and start stream of 3 monthly
                await sleep(5000);
                
                // stream txn
                const streamABI = ["function stream(address to, int96 flowRate, uint256 amount)"];
                const streamer = new ethers.Contract(process.env.PAINT_STREAMER, streamABI, signer);
                const flowRate = THREE_PER_MONTH;
                const drop = "4000000000000000000"; // 4 to start (actually 5 but we deduct one for the firstMint)
                const streamTxn = await streamer.populateTransaction.stream(user.safeAddress, flowRate, drop);
                console.log("streamData", streamTxn.data);
                const streamRequest = {
                    "chainId": network.chainId,
                    "target": process.env.PAINT_STREAMER,
                    "data": streamTxn.data,
                    "user": await signer.getAddress(),
                    "userNonce": parseInt(nonce) + 1
                };
                console.log("request", streamRequest);
                const streamRelayResponse = await relay.sponsoredCallERC2771(
                    streamRequest,
                    signer,
                    process.env.GELATO_API_KEY
                );
                console.log(streamRelayResponse, JSON.stringify(streamRelayResponse));
            } else {
                if (minterAddress != post.user) {
                    return; // if not a "first mint", let the /api/mint endpoint handle it
                }
                // relay the mint
                // Generate the target payload
                const mintTxn = await nft.populateTransaction.selfMint(user.safeAddress);
                console.log(mintTxn.data);
                const request = {
                    "chainId": network.chainId,
                    "target": nftAddress,
                    "data": mintTxn.data,
                    "user": await signer.getAddress()
                };
                console.log("request", request);
                const relayResponse = await relay.sponsoredCallERC2771(
                    request,
                    signer,
                    process.env.GELATO_API_KEY
                );
                console.log(relayResponse, JSON.stringify(relayResponse));
                if ("taskId" in relayResponse) {
                    await postDoc.ref.update({
                        "mintStatus": "pending",
                        "mintTaskId": relayResponse.taskId,
                        "nftContract": nftAddress.toLowerCase(),
                        "chain": defaultChainId
                    });
                } else {
                    console.log("error: relay error", JSON.stringify(relayResponse));
                }
            } // if firstMint
        } else {
            console.log("user not found for " + post.user);
        } // if user
    }
    return;
} // newPost

module.exports.newLike = async function(likeDoc, context) {
    const like = likeDoc.data();
    const postDoc = await db.collection('posts').doc(context.params.postId).get();
    const post = postDoc.data();
    const image = like.profileImage ? like.profileImage : `https://web3-images-api.kibalabs.com/v1/accounts/${like.user}/image`;
    const likeNotification = await db.collection('users').doc(post.user).collection('notifications').add({
        "image": image,
        "link": `https://airtist.xyz/p/${postDoc.id}`,
        "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
        "name": like.name ? like.name : abbrAddress(like.user),
        "text": ` liked your post `,
        "textLink": post.title ? post.title : ""
    });
} // newLike

module.exports.newComment = async function(commentDoc, context) {
    const comment = commentDoc.data();
    const postDoc = await db.collection('posts').doc(context.params.postId).get();
    const post = postDoc.data();
    const image = comment.profileImage ? comment.profileImage : `https://web3-images-api.kibalabs.com/v1/accounts/${comment.user}/image`;
    const commentNotification = await db.collection('users').doc(post.user).collection('notifications').add({
        "image": image,
        "link": `https://airtist.xyz/p/${postDoc.id}`,
        "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
        "name": comment.name ? comment.name : abbrAddress(comment.user),
        "text": ` commented on your post `,
        "textLink": post.title ? post.title : ""
    });
} // newLike

module.exports.newRepost = async function(repostDoc, context) {
    const repost = repostDoc.data();
    const postDoc = await db.collection('posts').doc(context.params.postId).get();
    const post = postDoc.data();
    const image = repost.profileImage ? repost.profileImage : `https://web3-images-api.kibalabs.com/v1/accounts/${repost.user}/image`;
    const repostNotification = await db.collection('users').doc(post.user).collection('notifications').add({
        "image": image,
        "link": `https://airtist.xyz/p/${repost.postId}`,
        "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
        "name": repost.name ? repost.name : abbrAddress(repost.user),
        "text": ` reposted your post `,
        "textLink": post.title ? post.title : ""
    });
} // newLike

module.exports.updateUser = async function(change, context) {
    const userBefore = change.before.data();
    const userAfter = change.after.data();
    if (userAfter.needApprovals) {
        // new contract get approvals
        if (userAfter.safeDeployed) {
            const nftAddress = userAfter.nftContract ? userAfter.nftContract : process.env.AIRTIST_ADDR;
            const resp = await doApprovals(userAfter.safeAddress, nftAddress);
            await change.after.ref.update({
                "needApprovals": false
            });
        }
    }
    if (userBefore.plan != userAfter.plan) {
        if (userAfter.plan == "pro") {
            // upgrade to pro
            var name = userAfter.nftContractName;
            var symbol = userAfter.nftContractSymbol;
            if (name && symbol) {
                const relayResponse = await deployNFTContractAndUpdateStream(name, symbol, userAfter.safeAddress);
                if ("taskId" in relayResponse) {
                    await change.after.ref.update({
                        "deployStatus": "pending",
                        "deployTaskId": relayResponse.taskId
                    });
                } else {
                    console.log("error: relay error", JSON.stringify(relayResponse));
                }
            } else {
                console.log("ERROR: trying to upgrade to pro without name & symbol", JSON.stringify(userAfter));
            }
        } else {
            // downgrade to free
            // 1. contract remains deployed (obvs), but flip user backed to shared contract
            await change.after.ref.update({
                "nftContractPro": userAfter.nftContract,
                "nftContract": process.env.AIRTIST_ADDR
            });
            await change.after.ref.collection('notifications').add({
                "image": userAfter.profileImage ? userAfter.profileImage : `https://web3-images-api.kibalabs.com/v1/accounts/${userAfter.address}/image`,
                "link": `https://airtist.xyz/`,
                "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
                "name": "",
                "text": `Your PRO plan has been cancelled`,
                "textLink": ""
            });
            // 2. reduce pAInt stream to 3 per month
            const relayResponse = await updateStream(userAfter.safeAddress, THREE_PER_MONTH, 0);
        }
    }
    if (userBefore.deployToChain != userAfter.deployToChain) {
        if (!userAfter.nftContractName || !userAfter.nftContractSymbol || !userAfter.safeAddress) {
            console.log(`ERROR: trying to deploy to chain but missing data on user doc`);
            return;
        }
        const relayResponse = await deployNFTContract(userAfter.nftContractName, userAfter.nftContractSymbol, userAfter.safeAddress, userAfter.deployToChain);
        console.log("remoteDeploy relayResponse", relayResponse);
        var updates = {};
        if ("taskId" in relayResponse) {
            updates.deployStatus = "pending";
            updates.deployTaskId = relayResponse.taskId;
        }
        await change.after.ref.update(updates);
    }
    return;
} // updateUser

module.exports.cronMint = async function(context) {
    console.log('This will be run every 1 minutes!');
    // 1. check mintTasks
    db.collection("posts").where("mintStatus", "==", "pending")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                const post = doc.data();
                post.id = doc.id;
                console.log("post", doc.id, JSON.stringify(post));
                if ("mintTaskId" in post) {
                    const task = await relay.getTaskStatus(post.mintTaskId);
                    console.log("mintTask status", JSON.stringify(task));
                    if (task.taskState == "ExecSuccess") {
                        if ("transactionHash" in task) {
                            const tx = await provider.getTransactionReceipt(task.transactionHash);
                            console.log("tx", JSON.stringify(tx));
                            const nft = new ethers.Contract(post.nftContract, nftJSON.abi, provider);
                            for (let i = 0; i < tx.logs.length; i++) {
                                const log = tx.logs[i];
                                if (log.address.toLowerCase() == post.nftContract.toLowerCase()) {
                                    const event = nft.interface.parseLog(log);
                                    console.log("event", JSON.stringify(event));
                                    if (event.name == "Transfer") {
                                        console.log("event.args.tokenId", event.args.tokenId);
                                        post.tokenId = parseInt(event.args.tokenId);
                                        await doc.ref.update({
                                            "mintStatus": "minted",
                                            "minted": true,
                                            "tokenId": parseInt(event.args.tokenId)
                                        });
                                        var notifyCreator = true;
                                        if ("minterAddress" in post) {
                                            if (post.mintChain == post.chain) {
                                                const minterNotification = await db.collection('users').doc(post.minterAddress.toLowerCase()).collection('notifications').add({
                                                    "image": `https://api.airtist.xyz/images/${post.id}.png`,
                                                    "link": `https://testnets.opensea.io/assets/goerli/${post.nftContract}/${post.tokenId}`,
                                                    "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
                                                    "text": `Minting has completed. `,
                                                    "textLink": "View on Opensea"
                                                });
                                            } else {
                                                await transportNFT(doc, post);
                                            }
                                            if (post.minterAddress.toLowerCase() == post.user.toLowerCase()) {
                                                notifyCreator = false;
                                            }
                                        } else {
                                            if (post.mintChain == post.chain) {
                                                // noop
                                            } else {
                                                await transportNFT(doc, post);
                                            }
                                        }
                                        if (notifyCreator) {
                                            const creatorNotification = await db.collection('users').doc(post.user).collection('notifications').add({
                                                "image": `https://api.airtist.xyz/images/${post.id}.png`,
                                                "link": `https://testnets.opensea.io/assets/goerli/${post.nftContract}/${post.tokenId}`,
                                                "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
                                                "text": `Your post has been minted. `,
                                                "textLink": "View on Opensea"
                                            });
                                        }
                                        const creatorDoc = await db.collection('users').doc(post.user).get();
                                        if (creatorDoc.exists) {
                                            await getBalances(creatorDoc.data());
                                        }
                                        if ("minterAddress" in post) {
                                            const minterDoc = await db.collection('users').doc(post.minterAddress).get();
                                            if (minterDoc.exists) {
                                                await getBalances(minterDoc.data());
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    } else if (task.taskState == "Cancelled") {
                        await doc.ref.update({
                            "mintStatus": "cancelled"
                        });
                    }
                }
            });
        });

} // cronMint

module.exports.cronDeploy = async function(context) {
    console.log('This will be run every 2 minutes!');
    // 1. check deployTasks
    db.collection("users").where("deployStatus", "==", "pending")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                const user = doc.data();
                console.log("user", doc.id, JSON.stringify(user));
                if ("deployTaskId" in user) {
                    const task = await relay.getTaskStatus(user.deployTaskId);
                    console.log("deployTask status", JSON.stringify(task));
                    if (task.taskState == "ExecSuccess") {
                        if ("transactionHash" in task) {
                            const deployProvider = providers[task.chainId];
                            const tx = await deployProvider.getTransactionReceipt(task.transactionHash);
                            console.log("tx", JSON.stringify(tx));
                            const factory = new ethers.Contract(process.env.AIRTIST_FACTORY, factoryJSON.abi, deployProvider);
                            for (let i = 0; i < tx.logs.length; i++) {
                                const log = tx.logs[i];
                                if (log.address.toLowerCase() == process.env.AIRTIST_FACTORY.toLowerCase()) {
                                    const event = factory.interface.parseLog(log);
                                    console.log("event", JSON.stringify(event));
                                    if (event.name == "AIrtNFTCreated") {
                                        console.log("event.args.nftContract", event.args.nftContract);
                                        if ("nftContract" in user) {
                                            // user already has their own contract -- new remote contract should match same address
                                            if (user.nftContract != event.args.nftContract.toLowerCase()) {
                                                console.log(`ERROR: deployed remote contract has different address from home chain`, user.nftContract, event.args.nftContract.toLowerCase());
                                            }
                                        }
                                        var updates = {
                                            "nftContract": event.args.nftContract.toLowerCase(),
                                            "deployStatus": "deployed",
                                            "deployedChains": firebase.firestore.FieldValue.arrayUnion(task.chainId)
                                        };
                                        if (task.chainId == defaultChainId) {
                                            updates.needApprovals = true;
                                        }
                                        const relayResponse = await grantTransporterRole(event.args.nftContract, task.chainId);
                                        console.log("role relayResponse", relayResponse);
                                        if ("taskId" in relayResponse) {
                                            updates.roleStatus = "pending";
                                            updates.roleTaskId = relayResponse.taskId;
                                        }
                                        await doc.ref.update(updates);
                                        if (task.chainId == defaultChainId) {
                                            await doc.ref.collection('notifications').add({
                                                "image": user.profileImage ? user.profileImage : `https://web3-images-api.kibalabs.com/v1/accounts/${user.address}/image`,
                                                "link": `https://airtist.xyz/`,
                                                "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
                                                "name": "",
                                                "text": `Upgrade to PRO plan is complete`,
                                                "textLink": ""
                                            });
                                            await getBalances(user);
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            });
        });

} // cronDeploy


