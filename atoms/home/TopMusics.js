import { useRouter } from 'next/router';
import React from 'react';
import CustomDisplayMusic from '../../components/custom/CustomDisplayMusic';
import { handleRoute } from '../../common/function';

const TopMusics = ({ musics = [] }) => {

  const router = useRouter()

  return (
    <div className='nft d-flex flex-row flex-wrap align-items-center justify-content-center'>
      <div className='d-flex flex-row flex-wrap align-items-center justify-content-center'>
        {musics.map((item, index) => (
          <CustomDisplayMusic key={index} music={item} onGoClick={() => handleRoute(router, `/musics/${item?._id}`)} />
        ))}
      </div>
    </div>
  );
}

export default TopMusics;
