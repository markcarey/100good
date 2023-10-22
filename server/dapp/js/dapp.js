const firebaseConfig = {
    apiKey: "AIzaSyA_gSxF5N8Xj1JnkvFdHvyqQMkG5KaPOlM",
    authDomain: "catsinhats-art.firebaseapp.com",
    projectId: "catsinhats-art",
    storageBucket: "catsinhats-art.appspot.com",
    messagingSenderId: "602969603041",
    appId: "1:602969603041:web:d5fd1471c3a03eec9cb0a0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

const zeroAddress = "0x0000000000000000000000000000000000000000";

const chains = {};
chains["1442"] = {
    "chainId":  ethers.utils.hexValue(1442),
    "chainName": "Polygon zkEVM Testnet",
    "nativeCurrency": {
        "name": "ETH",
        "symbol": "ETH",
        "decimals": 18
    },
    "rpcUrls": ["https://rpc.public.zkevm-test.net"],
    "blockExplorerUrls": ["https://testnet-zkevm.polygonscan.com"],
}

var addr = {};
addr.zkevm = {
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
    "nftAddress": "0x70e9D049403D43e1D6c2b34fF7dC94371F20eC91",
    "evmChainId": 1442,
    "testnet": true,
    "name": "Polygon zkEVM Testnet",
    "rpc": "polygonzkevm-testnet.g.alchemy.com/v2/Ptsa6JdQQUtTbRGM1Elvw_ed3cTszLoj",
    "slug": "zkevm",
    "folder": "",
    "native": "ETH",
    "contracts": {}
};

var chain = "zkevm";
var web3, cat, host, cfa;
var accounts = [];
var provider, ethersSigner;
var cats = [];
var resetCats;
var batchCount = 0;

const baseUrl = 'https://api.catsinhats.art/';
const message = "Sign in to Cats in Hats";

var tokenId;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

var allChains = ["zkevm"];
for (let i = 0; i < allChains.length; i++) {
    if ( addr[chain].nftAddress ) {
        var thisChain = allChains[i];
        const chainProvider = new ethers.providers.JsonRpcProvider({"url": "https://"+addr[thisChain].rpc});
        addr[thisChain].contracts.cat = new ethers.Contract(addr[thisChain].nftAddress, nftABI, chainProvider);
        host = new ethers.Contract(addr[thisChain].host, hostJSON.abi, chainProvider);
        addr[thisChain].contracts.cfa = new ethers.Contract(addr[thisChain].cfa, cfaJSON.abi, chainProvider);
    }
}

function getChainKey(chainId) {
    if (chainId.toString() == "1442" ) {
        return 'zkevm';
    }
}

function setupChain() {
    var rpcURL = addr[chain].rpc;
    const prov = {"url": "https://"+rpcURL};
    provider = new ethers.providers.JsonRpcProvider(prov);
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    }
    //var wssProvider = new ethers.providers.WebSocketProvider(
    //    "wss://" + rpcURL
    //);
    cat = new ethers.Contract(
        addr[chain].nftAddress,
        nftABI,
        provider
    );
    //web3 = AlchemyWeb3.createAlchemyWeb3("wss://"+rpcURL);
    web3 = AlchemyWeb3.createAlchemyWeb3("https://"+rpcURL);
    preload('https://catsinhats.art/img/minting.gif');
    preload('https://catsinhats.art/img/not-revealed.png');
}
setupChain();

provider.on("network", async (newNetwork, oldNetwork) => {
    if (oldNetwork) {
        //console.log(newNetwork, oldNetwork);
        const oldChain = chain;
        setChain(newNetwork.chainId);
        if (chain == oldChain) {
            // they switched to unsupported chain, so switch back
            await switchChain(addr[chain].evmChainId);
        } else {
            //console.log("switching to supported chain " + chain);
            setupChain();
            if ( addr[chain].testnet ) {
                $("#network").show();
            } else {
                $("#network").hide();
            }
            $("#minted-cats").html('');
            loadCats();
        }
    }
});

function loadCats () {
    if (resetCats) {
        resetCats();
    }
    resetCats = db.collection("nft").doc(addr[chain].nftAddress).collection('meta').orderBy("token_id", "asc")
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var meta = doc.data();
                meta.tokenId = doc.id;
                if ( $( "#cat-" + doc.id ).length <= 0 ) {
                    $("#minted-cats").prepend( getCatHTML(meta) );
                } else {
                    $( "#cat-" + doc.id ).replaceWith( getCatHTML(meta) );
                }
            });
    });
}

function setChain(chainId) {
    if (chainId == 80001) {
        //chain = "mumbai";
    }
    if (chainId == 420) {
        //chain = "optigoerli";
    }
    if (chainId == 5) {
        //chain = "goerli";
    }
    if (chainId == 421613) {
        chain = "arbitrumGoerli";
    }
    if (chainId == 42161) {
        chain = "arbitrumOne";
    }
    if (chainId == 1442) {
        chain = "zkevm";
    }
    if (chainId == 1287) {
        //chain = "moonbeam-alpha";
    }
}

function abbrAddress(address){
    if (!address) {
        address = accounts[0];
    }
    return address.slice(0,4) + "..." + address.slice(address.length - 4);
}

async function connect(){
    if (window.ethereum) {
        //console.log("window.ethereum true");
        await provider.send("eth_requestAccounts", []);
        ethersSigner = provider.getSigner();
        accounts[0] = await ethersSigner.getAddress();
        console.log(accounts);
        const res = await fetch(`/drip/${accounts[0]}`, { 
            method: 'GET', 
            headers: {
              "Content-Type": "application/json"
            }
        }); // fetch
        //var result = await res.json();
        const userChainHex = await ethereum.request({ method: 'eth_chainId' });
        const userChainInt = parseInt(userChainHex, 16);
        console.log("userChainInt", userChainInt);
        if (userChainInt in chains) {
            // supported chain
            if (userChainInt != addr[chain].evmChainId) {
                // connected to supported chain but not the current chain
                setChain(userChainInt);
                setupChain();
                loadCats();
            }
        } else {
            await switchChain(addr[chain].evmChainId);
        }
        if ( addr[chain].testnet ) {
            $("#network").show();
        } else {
            $("#network").hide();
        }

        $(".address").text(abbrAddress());
        $("#offcanvas").find("button").click();
    } else {
        // The user doesn't have Metamask installed.
        console.log("window.ethereum false");
    } 
}

async function mint(quantity) {
    $("#mint-image").attr("src", 'https://catsinhats.art/img/minting.gif');
    const res = await fetch('/mint', { 
        method: 'GET', 
        headers: {
          "Content-Type": "application/json"
        }
    }); // fetch
    var result = await res.json();
    var tokenId = result.tokenId;
    console.log('tokenId:' + tokenId);
    const imageURL = `${baseUrl}images/${tokenId}.png`;
    preload(imageURL);
    $("#mint-image").attr("src", imageURL);
    $("#tokenid").text(tokenId);
    $("#mint-title").text("");
    $("#mint-title-label").text("Minted!");
    $("#mint-button").text("Minted!");
    await sleep(1000);
    $("#reset-button").show();
}

async function stream(tokenId) {
    if (!ethersSigner) {
        connect();
        return;
    }
    const flowRate = "1000000000000000000"; // 1 sToken per second
    const userData = ethers.utils.defaultAbiCoder.encode(["uint256"], [parseInt(tokenId)]);
    console.log("userData: ", userData);
    let iface = new ethers.utils.Interface(cfaJSON.abi);
    const txn = await host.connect(ethersSigner).callAgreement(
        addr[chain].cfa,
        iface.encodeFunctionData("createFlow", [
            addr[chain].sToken,
            addr[chain].superApp,
            flowRate,
            "0x"
        ]),
        userData
    );

}


async function switchChain(chainId) {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(chainId) }]
        });
    } catch (switchError) {
        console.log(switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                var switchParams = chains[chainId];
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        switchParams
                    ],
                });
                switchChain(chainId);
            } catch (addError) {
                // handle "add" error
            }
        }
        // handle other "switch" errors
    }
    setChain(chainId);
    setupChain();
}


function reset() {
    $("#mint-image").attr("src", "https://catsinhats.art/images/mint.png");
    $("#tokenid").text("?");
    $("#mint-title").text("Gasless Mint is ");
    $("#mint-title-label").text("Live");
    $("#mint-button").attr("href", "#").show().text("Mint Now");
    tokenId = null;
}

function getMarketplaceURL(currentChain, tokenId) {
    const slug = addr[currentChain].slug;
    const nftAddress = addr[currentChain].nftAddress;
    var subdomain = "";
    if ( addr[currentChain].testnet ) {
        subdomain = "testnets.";
    }
    var url = `https://${subdomain}opensea.io/assets/${slug}/${nftAddress}/${tokenId}`;
    return url;
}

function preload(url) {
    var image = new Image();
	image.src = url;
}


function getCatHTML(meta) {
    var html = ''
    var position = "n/a";
    for (let i = 0; i < meta.attributes.length; i++) {
        if (meta.attributes[i]["trait_type"] == "Position") {
            position = meta.attributes[i].value;
        }
    }
    const opensea = getMarketplaceURL(chain, meta.tokenId);
    html = `
    <div id="cat-${meta.tokenId}" class="col-sm-6 col-md-4">
        <div class="position-relative bg-dark-2 shadow rounded-4"> <img class="img-fluid d-flex rounded-4 rounded-bottom-0" src="${meta.image}" alt="">
        <div class="p-4">
            <div class="d-flex align-items-center"> <a href="${opensea}" class="overflow-hidden me-2">
            <h4 class="text-3 link-light text-truncate mb-0">CAT IN HAT #${meta.tokenId}</h4>
            </a>
            <a href="#" class="btn btn-primary rounded-pill ms-auto stream" data-id="${meta.tokenId}">Stream</a>
        </div>
        </div>
    </div>
    `;
    return html;
}

$( document ).ready(function() {

    loadCats();

    $(".connect").click(function(){
        connect();
        return false;
    });

    $("#mint-button").click(function(){
        if (tokenId) {
            return true;
        }
        $(this).text("Minting...");
        mint();
        return false;
    });

    $("#reset-button").click(function(){
        reset();
        $(this).hide();
        return false;
    });

    $("#cats").on("click", ".stream", function(){
        var id = $(this).data("id");
        stream(id);
        return false;
    });

    $(".switch").click(async function(){
        var chainId = $(this).data("chain");
        await switchChain(chainId);
        return false;
    });

});