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

## How it was Made