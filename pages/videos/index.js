import React from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import CustomDisplayVideo from '../../components/custom/CustomDisplayVideo';
import { GetVideos } from '../../common/api/noAuthApi';

const MyVideos = ({ videos }) => {
  return (
    <LayoutPage>
      <LayoutScreen title='All Videos' description='Upload the video for community content'>
        <div className='spacer-single' />

        <div className='d-flex flex-row flex-wrap align-items-center justify-content-center'>
          {videos.map((item, index) => <CustomDisplayVideo key={index} video={item} hidden />)}
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
};

export const getServerSideProps = async () => {

  const response = await GetVideos({})

  return {
    props: {
      videos: response || [],
    }
  }
}

export default MyVideos;
