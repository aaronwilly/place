import { Alchemy, Network } from 'alchemy-sdk';
import bigInt from 'big-integer';
import _ from 'underscore';
import UtilService from '../sip/utilService';
import {
  createAllLike,
  createReward,
  deleteAllLike,
  getAllLazyMints,
  getAllLike,
  getReward,
  updateReward
} from './api/authApi';
import { handleRoute } from './function';
import {
  ALCHEMY_KEY,
  GOERLI_MINT1155_ADDRESS,
  GOERLI_MINT721_ADDRESS,
  MAIN_MINT1155_ADDRESS,
  MAIN_MINT721_ADDRESS,
  MUMBAI_MINT1155_ADDRESS,
  MUMBAI_MINT721_ADDRESS,
  POLYGON_MINT1155_ADDRESS,
  POLYGON_MINT721_ADDRESS,
  PROD
} from '../keys';

const onGetSearchData = (req, cb) => { // account means that enable global calls
  return async () => {

    const resMetaSalt = await getAllLazyMints()

    const ethAlchemy = new Alchemy({
      apiKey: ALCHEMY_KEY,
      network: PROD ? Network.ETH_MAINNET : Network.ETH_GOERLI,
    });

    const polygonAlchemy = new Alchemy({
      apiKey: ALCHEMY_KEY,
      network: PROD ? Network.MATIC_MAINNET : Network.MATIC_MUMBAI,
    });

    const ethNfts721 = await ethAlchemy.nft.getNftsForContract(PROD ? MAIN_MINT721_ADDRESS : GOERLI_MINT721_ADDRESS);
    const ethNfts1155 = await ethAlchemy.nft.getNftsForContract(PROD ? MAIN_MINT1155_ADDRESS : GOERLI_MINT1155_ADDRESS);
    const polygonNfts721 = await polygonAlchemy.nft.getNftsForContract(PROD ? POLYGON_MINT721_ADDRESS : MUMBAI_MINT721_ADDRESS);
    const polygonNfts1155 = await polygonAlchemy.nft.getNftsForContract(PROD ? POLYGON_MINT1155_ADDRESS : MUMBAI_MINT1155_ADDRESS);
    const globalNFTs = [
      ...ethNfts721?.nfts, 
      ...ethNfts1155?.nfts, 
      ...polygonNfts721?.nfts, 
      ...polygonNfts1155?.nfts
    ]

    const all = globalNFTs?.map(x => {

      const hextokenId = UtilService.checkHexa(x.tokenId) ? x.tokenId : '0x' + bigInt(x.tokenId).toString(16);
      if(!x.rawMetadata.image) return null

      return {
        token_id: hextokenId?.toLocaleLowerCase(),
        contract_type: x.tokenType,
        last_metadata_sync: x.rawMetadata.date || x.timeLastUpdated,
        last_token_uri_sync: x.rawMetadata.date || x.timeLastUpdated,
        metadata: JSON.stringify(x.rawMetadata),
        token_address: x.contract.address,
        lazyMint: false,
        net: UtilService.checkNet(x.contract.address)
      }
    })

    // uniq nft
    const allFiltered = _.uniq([...resMetaSalt, ...(all || [])]?.filter(c => !!c), c => c.token_id)

    // filter created Date
    const filtered = allFiltered?.sort(function (a, b) {
      return new Date(b.last_token_uri_sync) - new Date(a.last_token_uri_sync)
    });

    cb({ data: filtered, count: resMetaSalt.length })
  }
};

const onLikes = (likeData, callback) => {
  if (likeData?.likerId) {
    return async () => {
      delete likeData.router

      const response = await getAllLike(likeData)

      if (response) {
        await deleteAllLike({ _id: response?._id })
      } else {
        await createAllLike(likeData)
      }
      callback()
    }
  } else {
    handleRoute(likeData?.router, '/login')
    return () => callback()
  }
}

const onSaveRewards = (request, cb) => {

  const { account, chainId, counts } = request;

  return async () => {
    if (!account) {
      return false;
    }

    const response = await getReward({ owner: account })
    if (!response) {
      if (chainId === '0x13881') {
        await createReward({
          owner: account,
          MUMBAI: Number(counts)
        })
      }
      if (chainId === '0x89') {
        await createReward({
          owner: account,
          POLYGON: Number(counts)
        })
      }
      if (chainId === '0x5') {
        await createReward({
          owner: account,
          GOERLI: Number(counts)
        })
      }
      if (chainId === '0x1') {
        await createReward({
          owner: account,
          ETH: Number(counts)
        })
      }
      cb();
    } else {
      if (chainId === '0x13881') {
        await updateReward({
          _id: response?._id,
          owner: account,
          MUMBAI: (response?.MUMBAI || 0) + Number(counts),
        })
      }
      if (chainId === '0x89') {
        await updateReward({
          _id: response?._id,
          owner: account,
          POLYGON: (response?.POLYGON || 0) + Number(counts),
        })
      }
      if (chainId === '0x5') {
        await updateReward({
          _id: response?._id,
          owner: account,
          GOERLI: (response?.GOERLI || 0) + Number(counts),
        })
      }
      if (chainId === '0x1') {
        await updateReward({
          _id: response?._id,
          owner: account,
          ETH: (response?.ETH || 0) + Number(counts),
        })
      }
      cb()
    }
  }
}

export {
  onGetSearchData,
  onLikes,
  onSaveRewards,
}
