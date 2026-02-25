import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';
import { deleteLazyMint } from '../../common/api/authApi';

const ModalDeleteNFT = ({ onClose, isOpen }) => {

  const router = useRouter()
  const dispatch = useDispatch()

  const { token_id } = router.query

  const onDeleteNFT = async () => {

    const response = await deleteLazyMint({ token_id })

    if (response?.success) {
      dispatch(addNotification(response?.message, 'success'))
      onClose()
      router.push('/nftmarketplace', undefined, { shallow: true }).then(() => router.reload())
    } else {
      dispatch(addNotification('Can\'t remove this NFT!', 'error'))
      onClose()
    }
  }

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title='Do you want to remove this NFT?'>
      <div className="mt-5 row justify-content-center">
        <div className="width-100 offer-btn" style={{ marginRight: 20 }} onClick={onClose}>Cancel</div>
        <div className='offer-btn buy-btn bg-red' style={{ width: 150 }} onClick={onDeleteNFT}>Remove</div>
      </div>
    </LayoutModal>
  );
};

export default ModalDeleteNFT;
