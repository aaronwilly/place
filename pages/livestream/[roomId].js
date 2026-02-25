import Image from 'next/image';
import React, { useEffect } from 'react';
import { selectIsConnectedToRoom, useHMSActions, useHMSStore } from '@100mslive/react-sdk';
import Room from '../../components/livestream/Room';
import LayoutGated from '../../components/layouts/layoutGated';
import { BlackLoading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import { getActiveRoom, getAppToken, getLiveStream, getManagementToken } from '../../common/api/authApi';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR } from '../../keys';

const RoomDetailPage = ({ userAgent, roomId, managementToken, livestream }) => {

  const { user } = useWeb3Auth()
  const hmsActions = useHMSActions()
  // const isConnected = useHMSStore(selectIsConnectedToRoom)

  useEffect(() => {

    const openApp = () => {
      window.location.href = `metasalt://livestream/${roomId}`;
    };

    const redirectToAppStore = () => {

      if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
        window.location.replace('https://onelink.to/gfnq8n');
      }
    };

    const checkAppAndRedirect = () => {

      if (userAgent.match(/iPhone|iPad|iPod/i)) {
        if (window.navigator.standalone === false) {
          setTimeout(() => redirectToAppStore(), 100);
        }

        const start = Date.now();
        const timeout = 1000;

        openApp();

        setTimeout(() => {
          const elapsed = Date.now() - start;
          if (elapsed < timeout + 20) redirectToAppStore();
        }, timeout);
      }

      if (userAgent.match(/Android/i)) {

        openApp();

        setTimeout(() => {
          if (document.hidden === false) redirectToAppStore();
        }, 2000);
      }
    };

    checkAppAndRedirect();
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      const activeRoom = await getActiveRoom(managementToken, roomId)
      if (activeRoom) {
        const authToken = await getAppToken({ roomId, userId: user?.username, role: 'hls-viewer' })
        await hmsActions.join({
          userName: user?.username,
          authToken: authToken,
        })
      } else {
        const authToken = await getAppToken({ roomId, userId: user?.username, role: 'broadcaster' })
        await hmsActions.join({
          userName: user?.username,
          authToken: authToken,
        })
      }
    }

    if (roomId && managementToken !== '') {
      // loadSession().then()
    }
  }, [roomId, managementToken, user])

  useEffect(() => {
    return () => {
      // hmsActions.leave().then()
    }
  }, [])

  return (
    <>
      {livestream?.creatorId !== user?.account && <LayoutGated data={livestream?.addedNFT} title={livestream?.name} />}
      <div className='livestream-container'>
        {/* {!isConnected && <BlackLoading />} */}
        {/* {isConnected &&
          <>
            <Room />
            <div className='w-100 m-0 d-flex flex-row' style={{ padding: 10 }}>
              <Image
                src={UtilService.ConvertImg(livestream.creator?.avatar) || DEMO_AVATAR}
                alt=''
                layout='fixed'
                width={60}
                height={60}
                className='br-50 p-0'
              />
              <div className='ms-2 p-0 pt-1 d-flex flex-column room-detail-content'>
                <h5 className='w-100 m-0 mt-1 p-0 text-ellipsis'>{livestream?.name}</h5>
                <p className='m-0 mt-1 p-0 fs-12'>{livestream?.description}</p>
              </div>
            </div>
          </>
        } */}
      </div>
    </>
  )
}

export const getServerSideProps = async ({ res, req, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

  const { roomId } = query

  const response1 = await getManagementToken()
  const response2 = await getLiveStream({ roomId })

  return {
    props: {
      userAgent,
      roomId,
      managementToken: response1 || null,
      livestream: response2 || null,
    }
  }
}

export default RoomDetailPage;
