import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { useWeb3Auth } from '../../services/web3auth';
import { createRequestOrder } from '../../common/api/authApi';
import UtilService from '../../sip/utilService';

const ItemRequestOrder = ({ myNFT, requestOrdersByTokenId }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [acceptedData, setAcceptedData] = useState(null)
  const { token_id: ercTokenId } = router.query

  useEffect(() => {
    setAcceptedData(requestOrdersByTokenId.find(item => item?.requestor === user?.account))
  }, [requestOrdersByTokenId, user?.account])

  const onRequestOrder = async () => {
    if (acceptedData) {
      dispatch(addNotification('You already requested this NFT! Please wait for the response from owner!', 'info'));
    } else {
      const response = await createRequestOrder({
        requestor: user?.account,
        acceptor: myNFT?.owner_of,
        tokenId: ercTokenId,
        confirmed: false,
      })
      if (response?.success) {
        dispatch(addNotification('Request sent! Please wait until NFT owner confirms your request!', 'success'))
        setAcceptedData(response?.data)
      }
    }
  }

  return (
    <div className={`offer-btn ${acceptedData && 'disable-btn'}`} onClick={onRequestOrder}>
      <span aria-hidden='true' className='icon_currency_alt fs-20' style={{ marginRight: 12 }}></span>
      {UtilService.requestText(acceptedData)}
    </div>
  );
}

export default ItemRequestOrder;
