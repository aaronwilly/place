import React from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import useWindowSize from '../../hooks/useWindowSize';
import { deleteCommunity } from '../../common/api/authApi';

const ModalDeleteGated = ({ onClose, GatedId, onSuccess }) => {

  const dispatch = useDispatch()
  const { width } = useWindowSize()

  const onDeleteGated = async () => {
    const response = await deleteCommunity({ _id: GatedId })
    if (response?.success) {
      onSuccess();
      onClose();
      dispatch(addNotification(response?.message, 'success'))
    }
  }

  return (
    <Modal isOpen={true} onRequestClose={onClose} style={width > 900 ? windowStyles : mobileStyles}>
      <span aria-hidden="true" className="icon_close_alt2 right-icon" onClick={onClose}></span>
      <h3 className="text-center color-b">Are you sure about removing this NFT Gated?</h3>
      <br/>
      <div className="row justify-content-around">
        <input
          type="button"
          value="Delete"
          onClick={onDeleteGated}
          className='btn-main'
          style={{ background: 'red', marginLeft: 10 }}
        />
        <input
          type="button"
          value="Cancel"
          onClick={onClose}
          className='btn-main'
          style={{ background: '#888', marginLeft: 10 }}
        />
      </div>
    </Modal>
  );
};

export default ModalDeleteGated;

const windowStyles = {
  content: {
    top: '55%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    width: 580,
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
    padding: 20
  },
};

const mobileStyles = {
  content: {
    top: '55%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    height: 500,
    width: 'calc(100% - 30px)',
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
    padding: 20
  },
};
