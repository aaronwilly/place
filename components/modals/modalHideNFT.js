import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';
import { useWeb3Auth } from '../../services/web3auth';
import { createHideNFT, getHideNFTByTokenIdAndTokenAddress, handleHideNFTDeletionById } from '../../common/api/authApi';

const ModalHideNFT = ({ onClose, onSuccess, isOpen, hidden }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()

  const { net, token_address, token_id } = router.query;

  const onHideNFT = async () => {

    const response1 = await getHideNFTByTokenIdAndTokenAddress({ net, token_id, token_address })

    if (response1 && response1.deleted) {
      const response2 = await handleHideNFTDeletionById({ id: response1._id, option: false })
      if (response2) {
        onSuccess()
        dispatch(addNotification(response2.message, 'success'));
        onClose()
      }
    } else {
      response1 && await handleHideNFTDeletionById({ id: response1._id, option: true })
      !response1 && await createHideNFT({ net, token_address, token_id, owner: user?.account })
      onSuccess()
      dispatch(addNotification('Hide successful', 'success'))
      onClose()
    }
  }

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title={`Do you want to ${!hidden ? 'hide' : 'enable'} this NFT?`}>
      <div className="mt-5 row justify-content-center">
        <div className="width-100 offer-btn" onClick={onClose} style={{ marginRight: 20 }}>Cancel</div>
        <div className='offer-btn buy-btn bg-secondary' style={{ width: 150 }} onClick={onHideNFT}>
          {!hidden ? 'Hide' : 'Enable'}
        </div>
      </div>
    </LayoutModal>
  );
};

export default ModalHideNFT;
