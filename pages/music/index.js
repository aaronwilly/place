import React from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import CustomSlide from '../../components/custom/CustomSlide';
import { GetMusicChannels } from '../../common/api/noAuthApi';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';

const MusicHome = ({ musicChannels }) => {

  return (
    <LayoutPage>
      <LayoutScreen title='Music Community'>
        <div className='mt-30 mb-5 d-flex flex-wrap justify-content-center'>
          {musicChannels?.map((item, index) => (
            <div key={index} className='mt-10'>
              <CustomSlide
                index={index + 1}
                avatar={UtilService.ConvertImg(item?.avatar) || DEMO_AVATAR}
                banner={UtilService.ConvertImg(item?.banner) || DEMO_BACKGROUND}
                username={item?.title}
                uniqueId={item?.description}
                collectionId={item?._id}
                music={true}
              />
            </div>
          ))}
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response = await GetMusicChannels({})

  return {
    props: {
      musicChannels: response || [],
    }
  }
}

export default MusicHome;
