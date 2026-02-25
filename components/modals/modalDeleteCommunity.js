import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';
import { deleteCommunity } from '../../common/api/authApi';
import { handleRoute } from '../../common/function';

const ModalDeleteCommunity = ({ communityId, onClose }) => {

  const router = useRouter()
  const dispatch = useDispatch()

  const onDeleteNFT = async () => {
    const response = await deleteCommunity({ _id: communityId })
    if (response) {
      dispatch(addNotification('Remove successful', 'success'))
      onClose()
      handleRoute(router, '/nftcommunities')
      router.reload()
    } else {
      dispatch(addNotification('Can\'t remove this Community!', 'error'))
      onClose()
    }
  }

  return (
    <LayoutModal isOpen={true} title='Do you want to remove this Community?' onClose={onClose}>
      <div className='mt-5 d-flex flex-row justify-content-center'>
        <div className='width-100 offer-btn' style={{ marginRight: 20 }} onClick={onClose}>Cancel</div>
        <button className='width-150 btn btn-danger' onClick={onDeleteNFT}>Remove</button>
      </div>
    </LayoutModal>
  );
};

export default ModalDeleteCommunity;
