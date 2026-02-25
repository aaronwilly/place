import { axiosInstance } from '../axios';
import { handleAPICatch } from '../function';
import { BackendUrl, NotificationBaseUrl, RoomsUrl, SessionUrl, SMSBaseUrl } from '../../keys';

export const updateUser = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/user/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateUser', JSON.stringify(e))
    return null
  }
}

export const updateFcmToken = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/user/update-fcmToken`, body)
    return data
  } catch (e) {
    handleAPICatch('updateFcmToken', JSON.stringify(e))
    return null
  }
}

export const updateBalance = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/user/update-balance`, body)
    return data
  } catch (e) {
    handleAPICatch('updateBalance', JSON.stringify(e))
    return null
  }
}

export const deleteUser = async body => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/user/delete`, body);
    return data;
  } catch (e) {
    handleAPICatch('deleteUser', JSON.stringify(e));
    return null;
  }
};

export const getAllLikes = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/allLike/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getAllLikes', JSON.stringify(e))
    return null
  }
}

export const getAllLike = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/allLike/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getAllLike', JSON.stringify(e))
    return null
  }
}

export const createAllLike = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/allLike/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createAllLike', JSON.stringify(e))
    return null
  }
}

export const deleteAllLike = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/allLike/delete`, body)
    return data
  } catch (e) {
    handleAPICatch('deleteAllLike', JSON.stringify(e))
    return null
  }
}

export const getBrands = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/brand/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getBrands', JSON.stringify(e))
    return null
  }
}

export const getBrand = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/brand/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getBrand', JSON.stringify(e))
    return null
  }
}

export const createBrand = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/brand/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createBrand', JSON.stringify(e))
    return null
  }
}

export const updateBrand = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/brand/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateBrand', JSON.stringify(e))
    return null
  }
}

export const getCollections = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/collection/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getCollections', JSON.stringify(e))
    return null
  }
}

export const getCollection = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/collection/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getCollection', JSON.stringify(e))
    return null
  }
}

export const createCollection = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/collection/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createCollection', JSON.stringify(e))
    return null
  }
}

export const updateCollection = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/collection/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateCollection', JSON.stringify(e))
    return null
  }
}

export const deleteCollection = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/collection/delete`, body)
    return data
  } catch (e) {
    handleAPICatch('deleteCollection', JSON.stringify(e))
    return null
  }
}

export const createComment = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/comment/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createComment', JSON.stringify(e))
    return null
  }
}

export const getCommunities = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/community/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getCommunities', JSON.stringify(e))
    return null
  }
}

export const createCommunity = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/community/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createCommunity', JSON.stringify(e))
    return null
  }
}

export const updateCommunity = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/community/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateCommunity', JSON.stringify(e))
    return null
  }
}

export const deleteCommunity = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/community/delete`, body)
    return data
  } catch (e) {
    handleAPICatch('deleteCommunity', JSON.stringify(e))
    return null
  }
}

export const getDiscourses = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/discourse/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getDiscourses', JSON.stringify(e))
    return null
  }
}

export const createDiscourse = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/discourse/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createDiscourse', JSON.stringify(e))
    return null
  }
}

export const updateDiscourse = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/discourseServer/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateDiscourse', JSON.stringify(e))
    return null
  }
}

export const deleteDiscourse = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/discourseMessage/delete`, body)
    return data
  } catch (e) {
    handleAPICatch('deleteDiscourse', JSON.stringify(e))
    return null
  }
}

export const createDiscourseChannel = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/discourseChannel/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createDiscourseChannel', JSON.stringify(e))
    return null
  }
}

export const createDiscourseMessage = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/discourseMessage/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createDiscourseMessage', JSON.stringify(e))
    return null
  }
}

export const getAllLazyMints = async () => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/lazyMint/get-all`)
    return data.data
  } catch (e) {
    handleAPICatch('getAllLazyMints', JSON.stringify(e))
    return null
  }
}

export const getAllLazyMintsCount = async () => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/lazyMint/get-all-count`)
    return data.data
  } catch (e) {
    handleAPICatch('getAllLazyMintsCount', JSON.stringify(e))
    return null
  }
}

export const getLazyMint = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/lazyMint/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getLazyMint', JSON.stringify(e))
    return null
  }
}

export const createLazyMint = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/lazyMint/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createLazyMint', JSON.stringify(e))
    return null
  }
}

export const updateLazyMint = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/lazyMint/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateLazyMint', JSON.stringify(e))
    return null
  }
}

export const deleteLazyMint = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/lazyMint/delete`, body)
    return data
  } catch (e) {
    handleAPICatch('deleteLazyMint', JSON.stringify(e))
    return null
  }
}

export const createLazyMintTransfer = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/lazyMintTransfer/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createLazyMintTransfer', JSON.stringify(e))
    return null
  }
}

export const getLiveStreams = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/livestream/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getLiveStreams', JSON.stringify(e))
    return null
  }
}

export const getLiveStream = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/livestream/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getLiveStream', JSON.stringify(e))
    return null
  }
}

export const createLiveStream = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/livestream/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createLiveStream', JSON.stringify(e))
    return null
  }
}

export const updateLiveStream = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/livestream/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateLiveStream', JSON.stringify(e))
    return null
  }
}

export const deleteLiveStream = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/livestream/delete`, body)
    return data
  } catch (e) {
    handleAPICatch('deleteLiveStream', JSON.stringify(e))
    return null
  }
}

export const getManagementToken = async () => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/livestream/get-managementToken`)
    return data.data
  } catch (e) {
    handleAPICatch('getManagementToken', JSON.stringify(e))
    return null
  }
}

export const getAppToken = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/livestream/get-appToken`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getAppToken', JSON.stringify(e))
    return null
  }
}

export const getActiveSessions = async (managementToken) => {
  try {
    const { data } = await axiosInstance().get(`${SessionUrl}?active=true`, { headers: { Authorization: `Bearer ${managementToken}` } })
    return data.data
  } catch (e) {
    handleAPICatch('getActiveSessions', JSON.stringify(e))
    return null
  }
}

export const createRoom = async (managementToken, body) => {
  try {
    const { data } = await axiosInstance().post(RoomsUrl, body, {
      headers: {
        Authorization: `Bearer ${managementToken}`,
        'Content-Type': 'application/json',
      }
    })
    return data
  } catch (e) {
    handleAPICatch('createRoom', JSON.stringify(e))
    return null
  }
}

export const getActiveRoom = async (managementToken, roomId) => {
  try {
    const { data } = await axiosInstance().post('https://us-central1-metasaltnotifications.cloudfunctions.net/livestream/getActiveRoom', { managementToken, roomId })
    return data.data
  } catch (e) {
    handleAPICatch('getActiveRoom', JSON.stringify(e))
    return null
  }
}

export const endActiveRoom = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/livestream/end-activeRoom`, body)
    return data
  } catch (e) {
    handleAPICatch('endActiveRoom', JSON.stringify(e))
    return null
  }
}

export const createMintSupplyErc1155 = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/mintSupplyErc1155/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createMintSupplyErc1155', JSON.stringify(e))
    return null
  }
}

export const getMusicChannels = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/musicChannel/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getMusicChannels', JSON.stringify(e))
    return null
  }
}

export const getMusicChannel = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/musicChannel/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getMusicChannel', JSON.stringify(e))
    return null
  }
}

export const createMusicChannel = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/musicChannel/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createMusicChannel', JSON.stringify(e))
    return null
  }
}

export const updateMusicChannel = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/musicChannel/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateMusicChannel', JSON.stringify(e))
    return null
  }
}

export const getMusics = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/music/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getMusics', JSON.stringify(e))
    return null
  }
}

export const createMusic = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/music/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createMusic', JSON.stringify(e))
    return null
  }
}

export const getHideNFTByTokenIdAndTokenAddress = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/hideNFT/get-by-tokenId-tokenAddress`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getHideNFTByTokenIdAndTokenAddress', JSON.stringify(e))
    return null
  }
}

export const createHideNFT = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/hideNFT/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createHideNFT', JSON.stringify(e))
    return null
  }
}

export const handleHideNFTDeletionById = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/hideNFT/handle-delete`, body)
    return data
  } catch (e) {
    handleAPICatch('handleHideNFTDeletionById', JSON.stringify(e))
    return null
  }
}

export const getOrderData = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/orderData/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getOrderData', JSON.stringify(e))
    return null
  }
}

export const createOrderData = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/orderData/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createOrderData', JSON.stringify(e))
    return null
  }
}

export const updateOrderData = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/orderData/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateOrderData', JSON.stringify(e))
    return null
  }
}

export const deleteOrderData = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/orderData/delete`, body)
    return data
  } catch (e) {
    handleAPICatch('deleteOrderData', JSON.stringify(e))
    return null
  }
}

export const getReports = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/report/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getReports', JSON.stringify(e))
    return null
  }
}

export const updateReport = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/report/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateReport', JSON.stringify(e))
    return null
  }
}

export const createRequestOrder = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/requestOrder/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createRequestOrder', JSON.stringify(e))
    return null
  }
}

export const updateRequestOrder = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/requestOrder/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateRequestOrder', JSON.stringify(e))
    return null
  }
}

export const getReward = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/reward/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getReward', JSON.stringify(e))
    return null
  }
}

export const createReward = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/reward/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createReward', JSON.stringify(e))
    return null
  }
}

export const updateReward = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/reward/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateReward', JSON.stringify(e))
    return null
  }
}

export const createCharge = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/stripe/charge/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createCharge', JSON.stringify(e))
    return null
  }
}

export const getTermsAccepted = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/termsAccepted/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getTermsAccepted', JSON.stringify(e))
    return null
  }
}

export const createTermsAccepted = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/termsAccepted/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createTermsAccepted', JSON.stringify(e))
    return null
  }
}

export const getAllVerifications = async () => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/verification/get-all`)
    return data.data
  } catch (e) {
    handleAPICatch('getAllVerifications', JSON.stringify(e))
    return null
  }
}

export const getVerification = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/verification/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getVerification', JSON.stringify(e))
    return null
  }
}

export const createVerification = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/verification/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createVerification', JSON.stringify(e))
    return null
  }
}

export const getVideos = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/video/get`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getVideos', JSON.stringify(e))
    return null
  }
}

export const getVideo = async (params) => {
  try {
    const { data } = await axiosInstance().get(`${BackendUrl}/video/get-one`, { params })
    return data.data
  } catch (e) {
    handleAPICatch('getVideo', JSON.stringify(e))
    return null
  }
}

export const createVideo = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/video/create`, body)
    return data
  } catch (e) {
    handleAPICatch('createVideo', JSON.stringify(e))
    return null
  }
}

export const updateVideo = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${BackendUrl}/video/update`, body)
    return data
  } catch (e) {
    handleAPICatch('updateVideo', JSON.stringify(e))
    return null
  }
}

export const getUserNotifications = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${NotificationBaseUrl}getUserNotifications`, body)
    return data.data
  } catch (e) {
    handleAPICatch('getUserNotifications', JSON.stringify(e))
    return []
  }
}

export const bulkMarkAsReadUserNotifications = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${NotificationBaseUrl}bulkMarkAsReadUserNotifications`, body)
    return data.data
  } catch (e) {
    handleAPICatch('bulkMarkAsReadUserNotifications', JSON.stringify(e))
    return null
  }
}

export const sendNotification = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${NotificationBaseUrl}sendNotification`, body)
    return data.data
  } catch (e) {
    handleAPICatch('sendNotification', JSON.stringify(e))
    return null
  }
}

export const smsVerification = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${SMSBaseUrl}smsVerification`, body)
    return data
  } catch (e) {
    handleAPICatch('smsVerification', JSON.stringify(e))
    return null
  }
}

export const smsVerificationCheck = async (body) => {
  try {
    const { data } = await axiosInstance().post(`${SMSBaseUrl}smsVerificationCheck`, body)
    return data
  } catch (e) {
    handleAPICatch('smsVerificationCheck', JSON.stringify(e))
    return null
  }
}
