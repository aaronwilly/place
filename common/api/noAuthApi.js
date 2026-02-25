import axios from 'axios';
import { BackendUrl } from '../../keys';
import { handleAPICatch } from '../function';

export const GetHomePageData = async () => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/page/home`)
    return data.data
  } catch (e) {
    handleAPICatch('GetHomePageData', JSON.stringify(e))
    return null
  }
}

export const GetNFTMarketplacePageData = async () => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/page/nftMarketplace`)
    return data.data
  } catch (e) {
    handleAPICatch('GetNFTMarketplacePageData', JSON.stringify(e))
    return null
  }
}

export const GetNFTMarketplaceDetailPageData = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/page/nftMarketplace/detail`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetNFTMarketplaceDetailPageData', JSON.stringify(e))
    return null
  }
}

export const GetFollowingPageData = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/page/following`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetFollowingPageData', JSON.stringify(e))
    return null
  }
}


export const GetAllLikes = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/allLike/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetAllLikes', JSON.stringify(e))
    return null
  }
}

export const GetBrands = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/brand/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetBrands', JSON.stringify(e))
    return null
  }
}

export const GetBrand = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/brand/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetBrand', JSON.stringify(e))
    return null
  }
}

export const GetCollections = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/collection/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetCollections', JSON.stringify(e))
    return null
  }
}

export const GetComments = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/comment/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetComments', JSON.stringify(e))
    return null
  }
}

export const GetCommunities = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/community/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetCommunities', JSON.stringify(e))
    return null
  }
}

export const GetCommunity = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/community/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetCommunity', JSON.stringify(e))
    return null
  }
}

export const GetDiscourses = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/discourse/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetDiscourses', JSON.stringify(e))
    return null
  }
}

export const GetDiscourse = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/discourse/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetDiscourse', JSON.stringify(e))
    return null
  }
}

export const GetDiscourseChannels = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/discourseChannel/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetDiscourseChannels', JSON.stringify(e))
    return null
  }
}

export const GetDiscourseChannel = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/discourseChannel/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetDiscourseChannel', JSON.stringify(e))
    return null
  }
}

export const GetDiscourseMessages = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/discourseMessage/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetDiscourseMessages', JSON.stringify(e))
    return null
  }
}

export const GetAllLazyMints = async () => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/lazyMint/get-all`)
    return data.data
  } catch (e) {
    handleAPICatch('GetAllLazyMints', JSON.stringify(e))
    return null
  }
}

export const GetLazyMint = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/lazyMint/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetLazyMint', JSON.stringify(e))
    return null
  }
}

export const GetMusics = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/music/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetMusics', JSON.stringify(e))
    return null
  }
}

export const GetMusic = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/music/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetMusic', JSON.stringify(e))
    return null
  }
}

export const GetMusicChannels = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/musicChannel/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetMusicChannels', JSON.stringify(e))
    return null
  }
}

export const GetMusicChannel = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/musicChannel/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetMusicChannel', JSON.stringify(e))
    return null
  }
}

export const GetAllNFTs = async () => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/nft/get-all`)
    return data.data
  } catch (e) {
    handleAPICatch('GetAllNFTs', JSON.stringify(e))
    return null
  }
}

export const GetNFTsByAddress = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/nft/get-address`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetNFTsByAddress', JSON.stringify(e))
    return null
  }
}

export const GetOnlineAccount = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/onlineAccount/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetOnlineAccount', JSON.stringify(e))
    return null
  }
}

export const CreateOnlineAccount = async (body) => {
  try {
    const { data } = await axios.post(`${BackendUrl}/web/onlineAccount/create`, body)
    return data
  } catch (e) {
    handleAPICatch('CreateOnlineAccount', JSON.stringify(e))
    return null
  }
}

export const UpdateOnlineAccount = async (body) => {
  try {
    const { data } = await axios.post(`${BackendUrl}/web/onlineAccount/update`, body)
    return data
  } catch (e) {
    handleAPICatch('UpdateOnlineAccount', JSON.stringify(e))
    return null
  }
}

export const GetOrderData = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/orderData/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetOrderData', JSON.stringify(e))
    return null
  }
}

export const GetAllUsers = async () => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/user/get-all`)
    return data.data
  } catch (e) {
    handleAPICatch('GetAllUsers', JSON.stringify(e))
    return null
  }
}

export const GetUser = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/user/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetUser', JSON.stringify(e))
    return null
  }
}

export const GetVerification = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/verification/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetVerification', JSON.stringify(e))
    return null
  }
}

export const GetVideos = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/video/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetVideos', JSON.stringify(e))
    return null
  }
}

export const GetVideo = async (params) => {
  try {
    const { data } = await axios.get(`${BackendUrl}/web/video/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('GetVideo', JSON.stringify(e))
    return null
  }
}

export const getCollection = async params => {
  try {
    const { data } = await axios.get(`${BackendUrl}/collection/get-one`, { params });
    return data.data;
  } catch (e) {
    handleAPICatch('getCollection', e, setStatusCode);
    return null;
  }
};

export const loginToBackend = async (body) => {
  try {
    const { data } = await axios.post(`${BackendUrl}/login`, body)
    return data
  } catch (e) {
    handleAPICatch('loginToBackend', JSON.stringify(e))
    return null
  }
}

export const createReferral = async (body) => {
  try {
    const { data } = await axios.post(`${BackendUrl}/referral/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createReferral', JSON.stringify(e))
    return null
  }
}

export const checkTransferRequest = async params => {
  try {
    const { data } = await axios.get(`${BackendUrl}/email/request-check`, { params });
    return data.data;
  } catch (e) {
    handleAPICatch('checkTransferRequest', JSON.stringify(e));
    return null;
  }
};

export const transferRequest = async (body) => {
  try {
    const { data } = await axios.post(`${BackendUrl}/email/request`, body)
    return data
  } catch (e) {
    handleAPICatch('transferRequest', JSON.stringify(e))
    return null
  }
}

export const createTeamEmail = async (body) => {
  try {
    const { data } = await axios.post(`${BackendUrl}/teamEmail/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createTeamEmail', JSON.stringify(e))
    return null
  }
}
