import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import { useWeb3Auth } from '../../services/web3auth';
import { getActiveSessions, getLiveStreams, getManagementToken } from '../../common/api/authApi';
import { LiveStreamImages, LiveStreamTypes, YoutubeLiveIds } from '../../common/constant';
import { GetRandomInt, handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';
import { IcPencil } from '../../common/icons';
import { DEMO_AVATAR } from '../../keys';

const LiveStreamCarousel = dynamic(() => import('../../components/livestream/Carousal'), { ssr: false });

const LiveStreamPage = ({ managementToken, allRooms }) => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [activeSessions, setActiveSessions] = useState([])
  const [selectedType, setSelectedType] = useState('')

  const myRooms = useMemo(() => allRooms.filter(item => item?.creator?.account === user?.account), [allRooms, user])

  useEffect(() => {
    const loadData = async () => {
      const activeSessions = await getActiveSessions(managementToken)
      activeSessions && setActiveSessions(activeSessions)
    }

    managementToken && loadData().then()
  }, [managementToken])

  const getSessionRoom = (roomId) => {
    return allRooms.find(item => item?.roomId === roomId)
  }

  const onTypeSelected = item => setSelectedType(item.value)

  const filterRooms = () => {
    if (selectedType === '') {
      return myRooms
    } else {
      return myRooms.filter(item => item.type === selectedType)
    }
  }

  return (
    <LayoutPage>
      <div className='livestream-carousel'>
        <LiveStreamCarousel />
      </div>
      <div className='p-3'>
        <div className='p-3'>
          <h2>{(activeSessions.length + YoutubeLiveIds.length) > 0 ? 'Active sessions' : 'No active sessions'}</h2>
        </div>
        <div className='row m-0 px-3'>
          {activeSessions.map((item, index) => (
            <div key={index} className='col-lg-3 col-md-4 col-sm-6 p-1'>
              <div className='bg-1 p-2 card liveStream-room-card' onClick={() => handleRoute(router, `/livestream/${item.room_id}`)}>
                <picture>
                  <img src={UtilService.ConvertImg(getSessionRoom(item.room_id)?.image) || LiveStreamImages[GetRandomInt(6)]} alt='' className='room-card-image' />
                </picture>
                <div className='w-100 m-0 mt-2 d-flex flex-row'>
                  <Image
                    src={UtilService.ConvertImg(getSessionRoom(item.room_id)?.creator?.avatar) || DEMO_AVATAR}
                    alt=''
                    width={40}
                    height={40}
                    className='br-50 p-0'
                  />
                  <div className='ms-2 p-0 pt-1 d-flex flex-column room-card-content'>
                    <h6 className='w-100 m-0 p-0 text-ellipsis'>{getSessionRoom(item.room_id)?.name}</h6>
                    <p className='m-0 p-0 fs-12'>{getSessionRoom(item.room_id)?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {YoutubeLiveIds.map((item, index) => (
            <div key={index} className='col-lg-3 col-md-4 col-sm-6 p-1'>
              <div className='bg-1 p-2 card liveStream-room-card' onClick={() => handleRoute(router, `/livestream/free/${item.videoId}`)}>
                <picture>
                  <img src={item.image} alt='' className='room-card-image' />
                </picture>
                <div className='w-100 m-0 mt-2 d-flex flex-row'>
                  <Image src={DEMO_AVATAR} alt='' width={40} height={40} className='br-50 p-0' />
                  <div className='ms-2 p-0 pt-1 d-flex flex-column room-card-content'>
                    <h6 className='w-100 m-0 p-0 text-ellipsis'>Admin</h6>
                    <p className='m-0 p-0 fs-12'>Admin</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='p-3'>
          <h2>Rooms</h2>
        </div>

        <div className='px-3 pb-3 livestream-types-container'>
          {LiveStreamTypes.map((item, index) => (
            <div key={index} className='btn livestream-type-card' onClick={() => onTypeSelected(item)}>
              {item.label}
            </div>
          ))}
        </div>

        <div className='row m-0 px-3'>
          {filterRooms().map((item, index) => (
            <div key={index} className='col-lg-3 col-md-4 col-sm-6 p-1'>
              <div className='bg-1 p-2 card liveStream-room-card'>
                <div className='cursor-pointer position-absolute' style={{ top: 2, right: 2 }} onClick={() => handleRoute(router, `/livestream/edit/${item?.roomId}`)}>
                  <Image src={IcPencil.src} alt='' layout='fixed' width={22} height={22} />
                </div>
                <picture onClick={() => handleRoute(router, `/livestream/${item?.roomId}`)}>
                  <img src={UtilService.ConvertImg(item?.image) || LiveStreamImages[GetRandomInt(6)]} alt='' className='room-card-image' />
                </picture>
                <div className='w-100 m-0 mt-2 d-flex flex-row' onClick={() => handleRoute(router, `/livestream/${item?.roomId}`)}>
                  <Image
                    src={UtilService.ConvertImg(item?.creator?.avatar) || DEMO_AVATAR}
                    alt=''
                    width={40}
                    height={40}
                    className='br-50 p-0'
                  />
                  <div className='ms-2 p-0 pt-1 room-card-content'>
                    <h6 className='w-100 m-0 p-0 text-ellipsis'>{item?.name}</h6>
                    <p className='m-0 p-0 fs-12'>{item?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutPage>
  )
};

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response1 = await getManagementToken()
  const response2 = await getLiveStreams({})

  return {
    props: {
      managementToken: response1 || null,
      allRooms: response2 || [],
    }
  }
}

export default LiveStreamPage;
