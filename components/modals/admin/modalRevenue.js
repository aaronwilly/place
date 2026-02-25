import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutModal from '../../layouts/layoutModal';
import { useWeb3Auth } from '../../../services/web3auth';
import { updateBalance } from '../../../common/api/authApi';
import UtilService from '../../../sip/utilService';
import { DEMO_AVATAR } from '../../../keys';

const ModalRevenue = ({ isOpen, onClose }) => {

  const dispatch = useDispatch()
  const { allUsers: users } = useWeb3Auth()
  const [selectedUser, setSelectedUser] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [amount, setAmount] = useState(1)

  const onModalClose = () => {
    setSelectedUser('')
    setSearchKey('')
    onClose()
  }

  const onAddUser = (item) => {
    setSelectedUser(item?.account)
  }

  const onSendRevenue = async () => {
    const response = await updateBalance({ account: selectedUser, amount })
    if (response?.success) {
      dispatch(addNotification('Sent Revenue Successful!', 'success'))
      onClose()
    }
  }

  return (
    <LayoutModal isOpen={isOpen} onClose={onModalClose} title={'Send Revenue'}>
      <div className="row justify-content-center pt-3">
        <input
          className="form-control"
          placeholder="Revenue amount"
          value={amount}
          onChange={e => setAmount(parseInt(e.target.value))}
          type='number'
        />

        <input
          className="form-control mb-0"
          placeholder="Search Username"
          value={searchKey}
          onChange={e => setSearchKey(e.target.value)}
        />

        <div style={{ maxHeight: 300, border: '1px solid grey' }} className='w-100 mt-1 mb-5 overflow-auto'>
          {users.filter(_item => _item.username?.toLowerCase()?.includes(searchKey?.toLowerCase())).map((item, index) =>
            <div
              key={index}
              className={`p-1 cursor-pointer d-flex flex-row align-items-center justify-content-between ${selectedUser === item?.account && 'bg-primary'} `}
              onClick={() => onAddUser(item)}
            >
              <div className='d-flex flex-row align-items-center'>
                <img src={UtilService.ConvertImg(item.avatar) || DEMO_AVATAR} alt='avatar' className='width-40 height-40 br-50' />
                <div className="ml-2">{item.username}</div>
              </div>
            </div>
          )}

          {users.filter(item => item.username?.toLowerCase()?.includes(searchKey?.toLowerCase())).length === 0 &&
            <p className="mt-3 text-center">No matched users!</p>
          }
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center">
          <div className="offer-btn width-100" onClick={onModalClose} style={{ marginRight: 20 }}>Cancel</div>
          <div className='offer-btn buy-btn bg-primary width-150' onClick={onSendRevenue}>Send</div>
        </div>
      </div>
    </LayoutModal>
  );
}

export default ModalRevenue;
