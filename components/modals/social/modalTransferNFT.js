import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutModal from '../../layouts/layoutModal';
import { TinyLoading } from '../../loading';
import { useWeb3Auth } from '../../../services/web3auth';
import UtilService from '../../../sip/utilService';
import {
  createLazyMint,
  createLazyMintTransfer,
  getLazyMint,
  sendNotification,
  updateLazyMint,
} from '../../../common/api/authApi';
import { DEMO_AVATAR } from '../../../keys';

const ModalTransferNFT = ({ onClose, isERC1155, isOpen }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, allUsers } = useWeb3Auth()
  const [userId, setUserId] = useState('')
  const [userKey, setUserKey] = useState('')
  const [count, setCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const { token_address, token_id } = router.query

  const onModalClose = useCallback(() => {
    setUserId(null)
    setUserKey(null)
    onClose()
  }, [onClose])

  const onTransferNFT = async () => {
    setIsLoading(true);

    const response = await getLazyMint({ token_id })
    if (response) {

      if (isERC1155) {
        await updateLazyMint({ _id: response._id, supply: Number(response.supply) - Number(count) })
        delete response._id
        await createLazyMint({ ...response, supply: Number(count), owner: userId, from_address: user?.account })
      } else {
        await updateLazyMint({ _id: response._id, owner: userId, from: user?.account })
      }

      await createLazyMintTransfer({
        from_address: user?.account,
        to_address: userId,
        amount: Number(count),
        token_id,
      })

      setIsLoading(false)

      dispatch(addNotification('Transfer successful', 'success'))
      const selectedUser = allUsers.find(item => item.account === userId)
      const link = `https://klik.cool/nftmarketplace/eth/${token_address}/${token_id}`;
      await sendNotification({
        userId: selectedUser?._id,
        account: user?.account || '',
        username: user.username,
        avatar: user.avatar,
        type: 'transfer',
        tag: null,
        link,
      })
      onModalClose()
      setTimeout(() => router.reload(), 2000)
    } else {
      setIsLoading(false)
      dispatch(addNotification('Can\'t transfer this NFT!', 'error'))
      onModalClose()
    }
  }

  return (
    <LayoutModal isOpen={isOpen} onClose={onModalClose} title='Transfer NFT without gas fee'>
      <div className="mt-5 row justify-content-center">

        <input
          className="form-control"
          placeholder="Search Username"
          value={userKey}
          onChange={e => setUserKey(e.target.value)}
        />

        {isERC1155 &&
          <input
            className="form-control"
            placeholder="Transfer counts"
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            type='number'
          />
        }

        <div className='w-100 mb-3 overflow-auto' style={{ maxHeight: 300, border: '1px solid grey' }}>
          {allUsers.filter(_item => user.account !== _item.account && _item.username?.toLowerCase()?.includes(userKey?.toLowerCase())).map((item, index) =>
            <div
              key={index}
              className={`p-1 d-flex flex-row align-items-center cursor-pointer ${userId === item.account && 'bg-primary'}`}
              onClick={() => setUserId(item.account)}
            >
              <div className='width-40 height-40 d-flex align-items-center justify-content-center'>
                <picture>
                  <img src={UtilService.ConvertImg(item.avatar) || DEMO_AVATAR} alt='avatar' className='width-40 height-40 br-50' />
                </picture>
              </div>
              <div className="ml-2">{item.username}</div>
            </div>
          )}

          {allUsers.filter(item => user.account !== item.account && item.username?.toLowerCase()?.includes(userKey?.toLowerCase())).length === 0 &&
            <p className="mt-3 text-center">No matched users!</p>
          }
        </div>

        {isLoading ?
          <TinyLoading />
          :
          <div className="d-flex flex-row align-items-center justify-content-center">
            <div className="width-100 offer-btn" style={{ marginRight: 20 }} onClick={onModalClose}>
              Cancel
            </div>
            <div className={`width-150 offer-btn buy-btn bg-primary ${!(userId && count > 0) && 'btn-disabled'}`} onClick={onTransferNFT}>
              Transfer
            </div>
          </div>
        }
      </div>
    </LayoutModal>
  );
};

export default ModalTransferNFT;
