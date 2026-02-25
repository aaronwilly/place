import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import CustomDisplayVideo from '../components/custom/CustomDisplayVideo';
import { useWeb3Auth } from '../services/web3auth';
import { getVideos } from '../common/api/authApi';
import { handleRoute } from '../common/function';

const MyVideos = () => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const response = await getVideos({ creatorId: user?.account })
      response && setVideos(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  return (
    <LayoutPage>
      <LayoutScreen title='My Videos' description='Upload the video for community content'>
        <div className="d-flex flex-column align-items-center justify-content-center">
          {videos?.length === 0 &&
            <div 
              className="alert alert-danger text-center cursor-pointer"
              style={{ width: 300, marginTop: 20 }}
              onClick={() => handleRoute(router, '/create/video')}
            >
              Upload your first video
            </div>
          }
        </div>

        <div className="spacer-single" />

        <div className="container d-flex flex-row flex-wrap align-items-center justify-content-center">
          {videos.map((item, index) => <CustomDisplayVideo key={index} video={item} />)}
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default MyVideos;
