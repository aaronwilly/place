import React from 'react';
import CustomDisplayVideo from '../../components/custom/CustomDisplayVideo';

const TopVideos = ({ videos = [] }) => {

  return (
    <div className='nft d-flex flex-row flex-wrap align-items-center justify-content-center'>
      <div className="d-flex flex-row flex-wrap align-items-center justify-content-center">
        {videos.map((item, index) =>
          <CustomDisplayVideo key={index} video={item} hidden />
        )}
      </div>
    </div>
  );
}

export default TopVideos;
