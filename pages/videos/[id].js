import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useWeb3Auth } from '../../services/web3auth';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutGated from '../../components/layouts/layoutGated';
import { onLikes } from '../../common/web3Api';
import { GetAllLikes, GetVideo, getCollection } from '../../common/api/noAuthApi';
import { BlackLoading } from '../../components/loading';

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  video {
    width: 30%;
  }
`
const Fav = styled.div`
  position: absolute;
  bottom: 12px;
  left: 20px;
`

const VideoDetailPage = ({ userAgent, id, video }) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useWeb3Auth();

  const [trigger, setTrigger] = useState(0);
  const [videoLikes, setVideoLikes] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);
  const [nfts, setNFTs] = useState(false);

  const isLike = videoLikes.find(item => item?.likerId === user?.account);

  useEffect(() => {

    const openApp = () => {
      window.location.href = `metasalt://videos/${id}`;
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
    const fetchAllLikes = async () => {
      const response = await GetAllLikes({ videoId: id })
      response && setVideoLikes(response)
    }

    fetchAllLikes()
  }, [id, trigger])

  useEffect(() => {
    onGetCollection(video?.collectionId)
  }, [video])

  const onGetCollection = async(x) => {
    const response = await getCollection({ _id: x });
    setisLoaded(true);
    setNFTs(response.addedNFT ? response.addedNFT[0] : [])
  }

  const onLikeVideo = async () => {
    const request = { videoId: id, type: 'video', likerId: user?.account, router }
    await dispatch(onLikes(request, () => setTrigger(trigger + 1)))
  }

  return (
    <LayoutPage>
      {nfts && <LayoutGated data={nfts} title={video?.title} />}
      <Container>
        <video controls src={`https://klik-medias.s3.amazonaws.com/video/${video?.videoId}`} preload='auto' />
      </Container>
      <Fav onClick={onLikeVideo}>
        <span className='icon_heart' style={{ marginRight: 12, color: isLike ? '#ff343f' : '#666' }} aria-hidden='true' />
        {videoLikes?.length || 0} favorites
      </Fav>

      {!isLoaded && <BlackLoading />}
    </LayoutPage>
  )
};

export const getServerSideProps = async ({ req, query }) => {

  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const { id } = query;

  const response = await GetVideo({ _id: id });

  return {
    props: {
      userAgent,
      id,
      video: response || null,
    }
  }
}

export default VideoDetailPage;
