import React from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { useWeb3Auth } from '../../services/web3auth';
import { transferRequest } from '../../common/api/noAuthApi';
import UtilService from '../../sip/utilService';

const ItemTransferRequest = ({ myNFT }) => {

  const dispatch = useDispatch()
  const { user } = useWeb3Auth()

  const onTransferRequest = async () => {
    const itemUrl = window !== undefined && window.location.href
    const { thumbnail } = (myNFT?.metadata && JSON.parse(myNFT?.metadata)) || ''
    const image = UtilService.ConvertImg(thumbnail)
    const owner = myNFT?.owner_of?.account
    const ownerUrl = window !== undefined && `${window.location.origin}/sales/${user?.account}`
    const lazyMintId = myNFT?._id
    const response = await transferRequest({
      itemUrl,
      image,
      lazyMintId: lazyMintId,
      owner,
      ownerUrl,
      account: user?.account,
    })
    if (response?.success) {
      dispatch(addNotification('Transfer request was sent successfully'));
    }
  }

  return (
    <div className='offer-btn' onClick={onTransferRequest}>
      Transfer Request
    </div>
  );
}

export default ItemTransferRequest;
