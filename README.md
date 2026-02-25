# Metasalt Production

1. ERC20 deployment
  - owner address, name (MetaSaltToken), symbol(MST), initialSupply
  - deployment fee (MATIC,  ETH, BNB)
    tx - deploy
    tx - init sc
    tx - link with nft sc
2. NFT deployment
  - owner address, name(MetaSaltNFT), symbol(MSN), erc20CreateRewardValue
  - deployment fee (MATIC,  ETH, BNB)
    tx - deploy
    tx - init sc
3. Market deployment (MetaSaltMarket)
  - owner address,  market fee receiver address,  market fee percent
  - deployment fee (MATIC,  ETH, BNB)
    tx - deploy
    tx - init sc
4. Authentication deployment (MetaSaltAuth)
  - owner address, RequestPrice for auth nft
  - deployment fee (MATIC, ETH, BNB)
    tx - deploy
    tx - init sc (edited) 


## References

https://crosschainbridge.org/ <br/>
https://tokenproof.xyz/<br/>
https://form.asana.com/?k=Gr_rM21R7BYvYJw4RXgJUQ&d=1187896536578697<br/>
https://mainnet.sign-art.app/marketplace/1?search=&status=verified<br/>
https://mintable.com/<br/>
https://www.sign-web.app/<br/>
https://re-how.net/all/1808416/<br/>
https://nftaccess.app/profile<br/>
https://upcomingnft.net/<br/>
## Airdrop Logic
1. if wallet already connected, check claimreward in airdrop contract to see if address is in merkle tree of approved wallets. If so, give a pop-up asking if they want to claim air drop rewards

2. if wallet is not already connected, ask use to enter their wallet address to check if their wallet is approved to receive an airdop. then, check smart contract to see if their address is in Merkle tree. If so, then ask them to connect wallet and claim reward


## API Documentation


The following table lists the configurable parameters of the moralis-api chart and the default values.

| Parameter                                                                 | Description                                                                                                       | Default                         |
|---------------------------------------------------------------------------| ------------------------------------------------------------------------------------------------------------------| ------------------------------- |
| **Auth**                                                                  |
| `_User`                                                                   | Getting all users from cloudfunction                                                                                             | ``         |
| `SupportedTransactionsAccepted`                                           | Metasalt modal show                                                                                               | ``                      |
| `TermsAccepted`                                                           | Terms modal show after login                                                                                      | ``                  |
| **Order**                                                                 |
| `RequestOrders`                                                           | Requests of orders                                                                                                | ``                             |
| `OrderData`                                                               | All Orders                                                                                    | ``                              |
| **NFT**                                                                   |
| `LazyMints`                                                               | NFT minted with gasless                                                                           | ``                      |
| `Rewards`                                                                 | Metasalt token ERC20 Rewards                                                                                            | ``                          |
| `Verification`                                                            | Authentication                                                                                | ``                         |
| **Social**                                                                |
| `TestLikes`                                                               | Social Page Favourite                                                                                                   | `userId, nftId`                         |
| `TestComments`                                                            | Social Page Comments                                                                                               | `userId, nftID, comment`                            |
| **Projects**                                                              |
| `Brands`                                                                  | Collections                                                                                          | `/`                             |
| `RealBrands`                                                              | Brands                                                                                            | ``                          |
| **History**                                                               |


proposed withdrawal process: if user mints, they get 1 token reward which is counted on Moralis and not directly deposited in their wallet to avoid fee. If user wants to receive tokens into their wallet (withdraw), they need to make withdrawal, which will cost the user gas fees. User needs to gas fees

proposed deposit process: if user buys tokens on open market, e.g., uniswap, and wants to deposit into Moralis db to use, e.g., authentication, then user calls smart contract which transfers tokens from user wallet into Metasalt "bank" wallet

https://www.youtube.com/watch?v=dJA5L4ZUTtU&ab_channel=WhiteboardCrypto

## Google Tag Manager for Android
https://developers.google.com/tag-platform/tag-manager/android/v5

## Google Tag Manager for IOS
https://developers.google.com/tag-platform/tag-manager/ios/v5


<br/>
magiceden.com<br/>
twitch.tv<br/>
taskrabbit.com<br/>
getstream.io<br/>

https://mintable.infura-ipfs.io/ipfs/QmfVSEaX7V686338zNYTMGbSvoCdScsZDPNy4FEgJPLrWi/<br/>
https://i.seadn.io/gae/zm3pS-oC0y0qr1e2R7ZK0EoKDyXsMiQbevryOUTg2ZBc8Xu0VBE2qQom21SxXAVVPMnkK_np1JyaVF_3zGXpnK-W_VJIDEzZiYKSSFw?auto=format&w=1920<br/>

uniq key filter
[...new Map(filterNFTs.map(item => [item[key], item])).values()]