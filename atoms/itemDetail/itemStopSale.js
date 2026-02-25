import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { useWeb3Auth } from '../../services/web3auth';
import { deleteOrderData } from '../../common/api/authApi';
import { handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';

const ItemStopSale = ({ setSwitchNetworkModal, priceChain, orderDataByTokenId }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, chain } = useWeb3Auth()

  const { token_id: ercTokenId } = router.query

  const onStopSale = async () => {
    const chainId = UtilService.getChain4(chain)

    if (priceChain !== chainId) {
      setSwitchNetworkModal(true)
      return false
    }

    const filtered = orderDataByTokenId.find(item => item?.completed === false)
    filtered && await deleteOrderData({ _id: filtered?._id })

    if (response?.success) {
      dispatch(addNotification('Cancelled Successful!', 'success'))
      setTimeout(() => handleRoute(router, '/mynfts'), 1000)
    }
  }

  return (
    <div>
      <div className='offer-btn stop-btn' onClick={onStopSale}>
        <span className='icon_tag_alt fs-20' style={{ marginRight: 12 }} aria-hidden='true'/>
        Stop Sale
      </div>
    </div>
  );
}

export default ItemStopSale;
