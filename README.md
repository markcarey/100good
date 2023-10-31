# Stream2Own NFTs

Stream2Own (S2O) NFTs are owned by higher streamer. Instead of buying and selling the NFTs, you send a real-time stream. As long as your stream continues, you are the owner of the NFT. But if someone sends a higher stream, they take ownership of the NFT. If you want it back, you have to start an even higher stream. Stream2Own NFTs are thus "always on sale" and always have a (per-second) price.

## Not to be confiused with "NFT Rentals"

While the owner is continually paying to own the NFT, _the object here is NOT to provide a rental system for conventional NFTs_. Becausr these NFTs cannot be "locked", they can always be immediately taken by anyone willing to start a higher stream. This is definitely not what you want if you own a valuable NFT that you wnat to monetize without giving up ownership. _Stream2Own NFTs are an entirely different animal, with various use cases that may not work with legacy NFTs_. Potential use cases include web3 game items and exclusive token-gated memberships. The game theory incentives may provide interesting opportunities for stream-traders and unique monetization approaches for NFT game, membership, and other projects.

## How it Works
1. An NFT collection and associated "Super App" are deployed via the S2O Factory. The NFT contract is (mostly) a typical NFT contract with a few minor differences.  The "Super App" uses the Superfluid protocol to receive and forward realtime streams of tokens, and trigger ownership changes of the NFTs.
2. When NFTs are minted, they remain with the NFT contract itself.
3. To "buy" an NFT, you send a stream of tokens to the Super App. If your proposed stream is the highest for the specified NFT, the stream is accepted and and the NFT is transferred to you.
4. Streams to the Super App are _forwarded_ as follows: a fee to the _feeRecipient_, a preiousOwner fee, and the remainder streaming to the NFT/App deployer.
5. If someone else sends a higher stream for your token, the NFT is transferred to them, and your stream is stopped. BUT, as the _previousOwner_, you start receiving a percentage of the new owner's stream, for as long as _their_ stream continues. So there can be benefits to having your NFT taken from you, depending on your perspective.
6. If you want the NFT back, you can repeat the process and send an even higher stream. Not that NFT deployer benefits from these trades and their incoming stream keeps increasing. This could be described as a unique model for NFT creator royalties -- deployers may take less up front from "mint fees" but stand to earn much more over time, if the NFTs are popular.

### 100 Good

https://100good.xyz

100 Good friends ... or 100 Good fans ... or 100 Good apes. `100 Good` is similar to Friend.tech but powered by Superfluid and Stream2Own NFTs, built for the GoodDollar ecosystem on Celo. GoodDollar users can easily deploy their own NFT collection with a maximum supply of 100 NFTs. To claim an NFT, other users must `Follow` you, which mints of of the NFT and starts stream to claim ownership of the NFT. Minus some small fees (as described above), the stream of `G$` goes to you. If all 100 NFTs are minted, others can choose to stream a higher flowRate of `G$` to claim ownership of their chosen NFT. Exclusive token-gated chat rooms come soon, similar to Friend.tech. NFT images are generated by AI based on a text prompt submitted by the collection owner.

#### Fees go back to GoodDollar

5% of all `100 Good` streams go to the `feeRecipient` which is the GoodDollar `UBIScheme` contract on Celo. This means that the fees are constantly increasing the pool of `G$` avaialble to claim each day. `100 Good` provides a way for GoodDollar users to earn income in the form of micro-streams, and with the fees going back to GoodDollar users, it serves as example of Regenerative Finance (ReFi) on the Celo network.

### Other Demo Frontend: Cats in Hats

https://catsinhats.art

Cats in Hats is a demo frontend for a single NFT/Super that was deployed (to Polygon zkEVM Testnet). Images are generated by AI (DALL-E by OpenAI). Gasless minting is provided via an API, but newly minted CATs are owned by the contract. Users can then use the [Stream] button to start streams of `FISH` Super Tokens in order to "own" the NFTs. (`FISH` are gaslessly airdropped to addresses that "connect" to the dapp, for purposes of the demo).

## How it was Made

Four contracts were deployed to Polygon zkEVM Testnet: a `Streamer` contract that deploys a streamable Super Token, a `S2OFactory` contract the deploys minimal clones of NFT contracts and Super Apps. The Super App is powered by the Superfluid Protocol and reacts to incoming streams. When conditions are met, it transfers the NFTs to new owners and forwards fees and proceeds in realtime, as described above.

For the Cats in Hats demo, Firebase was used to create an API, Firestore database, and cloud storage for OpenAI-generated images ... and to host the fontend dapp.