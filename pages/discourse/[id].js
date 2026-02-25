import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutGated from '../../components/layouts/layoutGated';
import Dashboard from '../../components/discourse/Dashboard';
import ChannelList from '../../components/discourse/channelList';
import ModalCreateChannel from '../../components/modals/modalCreateChannel';
import { useWeb3Auth } from '../../services/web3auth';
import { GetDiscourse, GetDiscourseChannels } from '../../common/api/noAuthApi';
import UtilService from '../../sip/utilService';
import { DEMO_DEFAULT_AVATAR } from '../../keys';

const Container = styled.div`
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 600px) {
    flex-direction: column
  }
`

const DiscourseDetailPage = ({ discourseId, discourse, discourseChannels }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [trigger, setTrigger] = useState(0)
  const [isCreateModal, setIsCreateModal] = useState(false)
  const [channelId, setChannelId] = useState('')

  const onChangeChannel = (x) => {
    if (!user?.account) {
      dispatch(addNotification('Please login before visiting our channel!', 'error'))
      return false
    }
    setChannelId(x._id)
  }

  const onCreateChannel = () => {
    if (!user?.account) {
      dispatch(addNotification('Please login before creating our channel!', 'error'))
      return false
    }
    setIsCreateModal(true)
  }

  return (
    <LayoutPage backHidden>
      {discourse?.addedNFT && <LayoutGated title={discourse?.title} data={discourse?.addedNFT} />}

      <Container className='h-full2'>
        <div className='p-2 color-b' style={{ minWidth: 60, background: '#1c1e1f' }}>
          <div>
            <picture>
              <img
                src="/img/icons/ic_back.png"
                alt="back"
                className='cursor-pointer'
                style={{ width: 30 }}
                onClick={() => router.back()}
              />
            </picture>
          </div>
          <picture>
            <img
              src={UtilService.ConvertImg(discourse?.thumbnail || DEMO_DEFAULT_AVATAR)}
              alt='thumbnail'
              className='mt-2'
              style={{ height: 46, width: 46, borderRadius: 23 }}
            />
          </picture>
        </div>

        <div className='p-2 color-b' style={{ minWidth: 240, background: '#303136' }}>

          <div className='d-flex flex-row justify-content-between'>
            <div className='fw-semibold cursor-pointer'>CHANNELS</div>
            <div className='cursor-pointer' style={{ marginRight: 8 }} onClick={onCreateChannel}>+</div>
          </div>

          <div className='mt-3 fw-semibold cursor-pointer d-flex align-items-center' onClick={() => setChannelId(null)}>
            <picture>
              <img src='/img/icons/ic_clap.png' alt='welcome' style={{ width: 22, marginRight: 5 }} />
            </picture>
            Welcome
          </div>

          {discourseChannels.map((item, index) =>
            <div key={index} className='cursor-pointer' style={{ marginTop: 4 }} onClick={() => onChangeChannel(item)}>
              # &nbsp;{item?.title}
            </div>
          )}
        </div>

        {channelId ? <ChannelList {...{ discourseId, channelId }} /> : <Dashboard {...{ discourseId, discourse, isAccess: true }} />}
      </Container>

      {isCreateModal &&
        <ModalCreateChannel
          discourseId={discourseId}
          onSuccess={() => {
            setIsCreateModal(false)
            setTrigger(trigger + 1)
          }}
          onClose={() => setIsCreateModal(false)}
        />
      }
    </LayoutPage>
  )
}

export const getServerSideProps = async ({ res, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const { id } = query

  const response1 = await GetDiscourse({ _id: id })
  const response2 = await GetDiscourseChannels({ discourseId: id })

  return {
    props: {
      discourseId: id,
      discourse: response1 || null,
      discourseChannels: response2 || [],
    }
  }
}

export default DiscourseDetailPage;
