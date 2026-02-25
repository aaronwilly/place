import Image from 'next/image';
import React, { useEffect } from 'react';
import { selectIsConnectedToRoom, useHMSActions, useHMSStore } from '@100mslive/react-sdk';
import FreeRoom from '../../../components/livestream/FreeRoom';
import LayoutGated from '../../../components/layouts/layoutGated';
import { BlackLoading } from '../../../components/loading';
import { useWeb3Auth } from '../../../services/web3auth';
import { getAppToken, getLiveStream } from '../../../common/api/authApi';
import { DEMO_AVATAR } from '../../../keys';

const FreeRoomDetailPage = ({ livestream }) => {

  const { user } = useWeb3Auth()

  const hmsActions = useHMSActions()
  const isConnected = useHMSStore(selectIsConnectedToRoom)

  useEffect(() => {
    const loadData = async () => {
      const authToken = await getAppToken({ roomId: '63982a5db3a13375ba6ee511', userId: user?.username, role: 'hls-viewer' })
      await hmsActions.join({
        userName: user?.username,
        authToken: authToken,
      })
    }

    loadData().then()

    return () => {
      hmsActions.leave().then()
    }
  }, [])

  return (
    <>
      {livestream?.userId !== user?._id && <LayoutGated data={livestream?.addedNFT} title={livestream?.name} />}
      <div className='livestream-container'>
        {!isConnected && <BlackLoading />}
        {isConnected &&
          <>
            <FreeRoom />
            <div className='w-100 m-0 d-flex flex-row' style={{ padding: 10 }}>
              <Image src={DEMO_AVATAR} alt='' layout='fixed' width={60} height={60} className='br-50 p-0' />
              <div className='ms-2 p-0 pt-1 d-flex flex-column room-detail-content'>
                <h5 className='w-100 m-0 mt-1 p-0 text-ellipsis'>Admin</h5>
                <p className='m-0 mt-1 p-0 fs-12'>Admin</p>
              </div>
            </div>
          </>
        }
      </div>
    </>
  )
}

export const getServerSideProps = async ({ query }) => {

  const { roomId } = query

  const response = await getLiveStream({ roomId })

  return {
    props: {
      roomId,
      livestream: response || null,
    }
  }
}

export default FreeRoomDetailPage;
