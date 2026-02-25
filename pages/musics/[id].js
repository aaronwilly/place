import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import LayoutGated from '../../components/layouts/layoutGated';
import { useWeb3Auth } from '../../services/web3auth';
import { onLikes } from '../../common/web3Api';
import { GetAllLikes, GetMusic } from '../../common/api/noAuthApi';
import { BACKEND_API } from '../../keys';

const MusicDetailPage = ({ musicId, music }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [trigger, setTrigger] = useState(0)
  const [videoURL, setVideoURL] = useState('')
  const [musicLikes, setMusicLikes] = useState([])

  const likedByMe = musicLikes.find(item => item?.likerId === user?.account)

  const onGetVideoURL = useCallback(async () => {
    if (!music?.musicId) return false;
    const response = await fetch(`${BACKEND_API}url/assets%2F${music?.musicId}`)
    const res = await response.json()
    setVideoURL(res.preSignedUrl)
  }, [music?.musicId])

  useEffect(() => {
    onGetVideoURL().then()
  }, [onGetVideoURL])

  useEffect(() => {
    const loadData = async () => {
      const response = await GetAllLikes({ musicId })
      response && setMusicLikes(response)
    }

    loadData().then()
  }, [musicId, trigger])

  const onLikeMusic = async () => {
    const likeData = { musicId, type: 'music', likerId: user?.account, router }
    await dispatch(onLikes(likeData, () => setTrigger(trigger + 1)))
  }

  return (
    <LayoutPage>
      {music?.addedNFT && <LayoutGated data={music?.addedNFT} title={music?.title} />}

      <LayoutScreen title={music?.title || 'Music'} description={music?.description || 'Play the music'}>
        <div className='container mt-5'>
          <div onClick={onLikeMusic} className='my-3 cursor-pointer'>
            <span className='icon_heart' style={{ marginRight: 12, color: likedByMe ? '#ff343f' : '#666' }} aria-hidden='true' />
            {musicLikes?.length || 0} favorites
          </div>

          {videoURL && <audio controls src={videoURL} preload='auto' className='w-100' />}
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ res, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const { id } = query;

  const response = await GetMusic({ _id: id })

  return {
    props: {
      musicId: id,
      music: response || null,
    }
  }
}

export default MusicDetailPage;
