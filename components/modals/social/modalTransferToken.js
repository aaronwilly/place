import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutModal from '../../layouts/layoutModal';
import { onSaveRewards } from '../../../common/web3Api';
import { useWeb3Auth } from '../../../services/web3auth';
import UtilService from '../../../sip/utilService';
import { DEMO_AVATAR } from '../../../keys';

const ModalTransferToken = ({ onClose, isOpen }) => {

  const dispatch = useDispatch();
  const [rewardUsers, setRewardUsers] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [count, setCount] = useState(1);
  const { allUsers: users, chain } = useWeb3Auth()
  const chainId = UtilService.getChain4(chain);

  const onModalClose = () => {
    setRewardUsers([]);
    setSearchKey(null);
    onClose();
  }

  const onAddRewardUser = (x) => {
    if (rewardUsers.includes(x)) {
      setRewardUsers(rewardUsers.filter(c => c !== x))
    } else {
      setRewardUsers([...rewardUsers, x])
    }
  }

  const onTransferNFT = async () => {
    rewardUsers.map(t => {
      const request = { account: t, chainId, counts: count }
      dispatch(onSaveRewards(request, () => { }))
    })
    onModalClose();
    dispatch(addNotification('Sent token Successful!', 'success'))
  }

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onModalClose}
      title={'Send Tokens for rewards'}
    >

      <div className="row justify-content-center mt-5">

        <input
          className="form-control"
          placeholder="Transfer counts"
          value={count}
          onChange={e => setCount(parseInt(e.target.value))}
          type='number'
        />

        <input
          className="form-control"
          placeholder="Search Username"
          value={searchKey}
          onChange={e => setSearchKey(e.target.value)}
        />

        <div style={{ maxHeight: 300, border: '1px solid grey', overflow: 'auto', marginTop: -15 }} className='w-100 mb-3'>
          {users.filter(_item => _item.username?.toLowerCase()?.includes(searchKey?.toLowerCase())).map((item, index) =>
            <div
              key={index}
              className={`p-1 cursor-pointer d-flex flex-row align-items-center justify-content-between ${rewardUsers.includes(item.account || item.id) && 'bg-primary'} `}
              onClick={() => onAddRewardUser(item.account || item.id)}
            >
              <div className='d-flex flex-row align-items-center'>
                <picture>
                  <img src={UtilService.ConvertImg(item.avatar) || DEMO_AVATAR} alt='avatar' className='width-40 height-40 br-50' />
                </picture>
                <div className="ml-2">{item.username}</div>
              </div>
            </div>
          )}

          {users.filter(item => item.username?.toLowerCase()?.includes(searchKey?.toLowerCase())).length === 0 &&
            <p className="mt-3 text-center">No matched users!</p>
          }
        </div>

        <div className="d-center d-row">
          <div className="offer-btn" onClick={onModalClose} style={{ width: 100, marginRight: 20 }}>
            Cancel
          </div>

          <div
            className={'offer-btn buy-btn bg-primary'}
            onClick={onTransferNFT}
            style={{ width: 150 }}
          >
            Send
          </div>
        </div>

      </div>

    </LayoutModal>
  );
};

export default ModalTransferToken;