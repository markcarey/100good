var functions = require('firebase-functions');
var firebase = require('firebase-admin');
var storage = firebase.storage();
const bucket = storage.bucket("catsinhats");
var db = firebase.firestore();

const express = require("express");
const api = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')();

const fetch = require('node-fetch');
const _ = require('lodash');
const moment = require('moment');

var imageDataURI = require("image-data-uri");
var textToImage = require("text-to-image");
var text2png = require('text2png');
var sigUtil = require("eth-sig-util");

const { ethers } = require("ethers");
const { nextTick } = require('async');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const factoryJSON = require(__base + "cats/abis/S2OFactory.json");
const nftJSON = require(__base + "cats/abis/S2ONFT.json");
const appJSON = require(__base + "cats/abis/S2OSuperApp.json");
const streamerJSON = require(__base + "cats/abis/Streamer.json");
const hostJSON = require(__base + "cats/abis/host.json");
const cfaJSON = require(__base + "cats/abis/cfa.json");
const superJSON = require(__base + "cats/abis/super.json");
const sTokenJSON = require(__base + "cats/abis/sToken.json");
const erc20JSON = require(__base + "cats/abis/erc20.json");

const message = "Sign in to Cats in Hats";

function getConfig(network) {
    var addr = {};

    const chain = "zkevm"; // "base", "zkevm

    if ("chain" == "base") {
        // Base addresses
        addr = {
            "size": "512x512",
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
        const provider = new ethers.providers.JsonRpcProvider({"url": process.env.API_URL_ZKEVMTESTNET});
        addr = {
            "provider": provider,
            "size": "512x512",
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
        addr.contracts = {
            "host": new ethers.Contract(addr.host, hostJSON.abi, provider),
            "cfa": new ethers.Contract(addr.cfa, cfaJSON.abi, provider),
            "cat": new ethers.Contract(addr.nft, nftJSON.abi, provider),
            "streamer": new ethers.Contract(addr.streamer, streamerJSON.abi, provider),
        }
    }
}

function getPromptAndMeta(id, config) {
  var prompt = `a cat wearing a hat, manga style, with solid color background`;
  const meta = {
    "name": `Cat in Hat #${id}`,
    "description": "AI generated cats in hat. Stream $FISH to own this cat.",
    "external_url": "https://catsinhats.art", 
    "image": `https://api.catsinhats.art/images/${id}.png`,
    "seller_fee_basis_points": 1000,
    "token_id": id,
    "attributes": [
        {
            "trait_type": "Aminal", 
            "value": "Cat",
        }, 
        {
            "trait_type": "ID", 
            "value": id.toString(),
        }
    ] 
  };
  return {"prompt": prompt, "meta": meta};
}

async function generate(id, config) {
  return new Promise(async (resolve, reject) => {
    const nftAddress = config.nft;
    const nft = getPromptAndMeta(id, config);
    //console.log("generate addr", config.nftAddress);
    const metaRef = db.collection('nft').doc(nftAddress).collection('meta').doc(id.toString());
    var doc = await metaRef.get();
    if (doc.exists) {
      // metadata already exists for this tokenId: assume image has also already been created and saved
      console.log(`generate: meta for nft ${nftAddress} / ${id} already exists`);
      resolve(true);
    } else {
      // 1. create image:
      var prompt = nft.prompt;
      const aiResponse = await openai.createImage({
        "prompt": prompt,
        "n": 1,
        "size": config.size
      });
      const result = await fetch(aiResponse.data.data[0].url);

      // 2. Save image to storage bucket
      const readStream = result.body;
      const writeStream = bucket.file(`${id}.png`).createWriteStream();
      readStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('finish', () => resolve(true));
      readStream.pipe(writeStream);

      // 3. Save metadata to Firestore
      await metaRef.set(nft.meta);
    }
  });
}

function getSig(req, res, next) {
  console.log(req.cookies["__session"]);
  var sig = null;
  if ("cookies" in req) {
    if ("__session" in req.cookies) {
      sig = req.cookies["__session"];
    }
  }
  req.sig = sig;
  next();
}

api.use(cors({ origin: true })); // enable origin cors
api.use(cookieParser);
api.use(getSig);

api.get(['/images/:id.png', '/:network/images/:id.png'], async function (req, res) {
  //console.log("network", req.params.network);
  console.log("start /images/ with path", req.path);
  const id = parseInt(req.params.id);
  const network = req.params.network;
  const config = getConfig(network);
  //console.log("image id", id);
  const nftAddress = config.nft;
  var cache = 'public, max-age=3600, s-maxage=86400';

  // Step 1: Validate
  var nft = config.contracts.nft; // nft contract
  var minted = false;
  const exists = await nft.exists(id);
  if ( exists ) {
    minted = true;
  }

  if ( !minted ) {
    return res.redirect('https://catsinhats.art/img/not-minted.png');
  }

  // Step 2: Fetch Image
  //console.log("path", req.path);
  var file;

  try {
    file = await bucket.file(`${id}.png`).download();
    //console.log(file);
  }
  catch (e) {
    console.log(`image: did not find image for ${req.path} for nft ${nftAddress} so generate image`);
    await generate(id, config);
    file = await bucket.file(`${id}.png`).download();
    //return res.json({"result": "catch: no file yet"});
  }

  if (!file) {
    console.log(`image: no file after try/catch for ${req.path} for nft ${nftAddress}`);
    return res.json({"result": "no file yet"});
  }

  const img = file[0];
  //res.set('Cache-Control', cache);
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  });
  return res.end(img);
}); // image

api.get(['/meta/:id', '/:network/meta/:id'], async function (req, res) {
  console.log("start /meta/ with path", req.path);
  const network = req.params.network;
  const config = getConfig(network);
  const nftAddress = config.nft;
  const id = parseInt(req.params.id);
  //console.log("id", id);
  var cache = 'public, max-age=3600, s-maxage=86400';

  // Step 1: Validate
  var nft = config.contracts.nft; // nft contract
  var minted = false;
  const exists = await nft.exists(id);
  if ( exists ) {
    minted = true;
  }

  if ( !minted ) {
    return res.json({ "error": "not minted" });
  }

  // Step 2: Get Meta JSON
  console.log(req.path);
  
  const metaRef = db.collection('nft').doc(nftAddress).collection('meta').doc(id.toString());
  var doc = await metaRef.get();

  if ( doc.exists ) {
    //res.set('Cache-Control', cache);
    return res.json(doc.data());
  } else {
    await generate(id, config);
    doc = await metaRef.get();
    if ( doc.exists ) {
      //res.set('Cache-Control', cache);
      return res.json(doc.data());
    } else {
      return res.json({"error": "metadata not found"});
    }
  }
}); // meta

module.exports.api = api;