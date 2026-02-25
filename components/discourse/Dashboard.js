import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { onLikes } from '../../common/web3Api';
import { GetAllLikes } from '../../common/api/noAuthApi';
import { handleRoute } from '../../common/function';
import { DEMO_DEFAULT_AVATAR } from '../../keys';

const Dashboard = ({ discourseId, discourse, isAccess }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [trigger, setTrigger] = useState(1)
  const [discourseLikes, setDiscourseLikes] = useState([])

  const likedByMe = discourseLikes.find(item => item?.likerId === user?.account)

  useEffect(() => {
    const loadData = async () => {
      const response = await GetAllLikes({ discourseId })
      response && setDiscourseLikes(response)
    }

    loadData().then()
  }, [discourseId, trigger])

  const onLikeDiscord = async () => {
    const likeData = { discourseId, type: 'discourse', likerId: user?.account, router }
    await dispatch(onLikes(likeData, () => setTrigger(trigger + 1)))
  }

  return (
    <div className='w-100 p-4 color-b d-flex flex-column' style={{ background: '#36393f' }}>
      <div className='d-flex flex-row-responsive align-items-center'>
        <picture>
          <img
            src={UtilService.ConvertImg(discourse?.thumbnail || DEMO_DEFAULT_AVATAR)}
            className='width-100 height-100 br-8'
            alt='thumbnail'
          />
        </picture>
        <div>
          <div className='ml-4 fs-32 fw-semibold'>{discourse?.title}</div>
          {discourse?.creator?.account === user?.account &&
            <div className='mt-2 ml-4 btn btn-primary' onClick={() => handleRoute(router, `/edit/discord/${discourseId}`)}>
              Edit
            </div>
          }
        </div>
      </div>

      <div onClick={onLikeDiscord} className='mt-3 cursor-pointer'>
        <span style={{ marginRight: 12, color: likedByMe ? '#ff343f' : '#666' }} aria-hidden="true" className="icon_heart"></span>
        {discourseLikes?.length || 0} favorites
      </div>

      <div className='mt-3 d-flex flex-row'>
        <div className='arial'>Name:&nbsp;</div>
        <div>{discourse?.title}</div>
      </div>

      <div className='d-flex flex-row'>
        <div className='arial'>Description:&nbsp;</div>
        <div>{discourse?.description}</div>
      </div>

      <div className='d-flex flex-row'>
        <span className='arial'>Creator:&nbsp;</span>
        <div>{discourse?.creator?.username}</div>
      </div>

      <div className='d-flex flex-row'>
        <span className='arial'>Access:&nbsp;</span>
        <div>{isAccess ? 'You can join this discourse server' : 'You don\'t have the NFTs needed to access this content.'}</div>
      </div>
    </div>
  )
}

export default Dashboard;
