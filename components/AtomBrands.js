import React from 'react';
import CustomSlide from './custom/CustomSlide';
import UtilService from '../sip/utilService';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../keys';

export const AtomBrands = ({ data, brand }) => (
  <div className='mt-30 d-flex flex-wrap align-items-center justify-content-center'>
    {data?.map((item, index) => (
      <div key={index} className="mt-10">
        <CustomSlide
          index={index + 1}
          avatar={UtilService.ConvertImg(item?.avatar) || DEMO_AVATAR}
          banner={UtilService.ConvertImg(item?.banner) || DEMO_BACKGROUND}
          username={item?.title}
          uniqueId={item?.description}
          collectionId={item?._id}
          brand={brand}
        />
      </div>
    ))}
  </div>
);
