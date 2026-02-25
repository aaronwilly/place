import React from 'react';
import CustomDisplayDiscord from '../../components/custom/CustomDisplayDiscord';

const TopDiscourse = ({ discourses = [] }) => {

  return (
    <div className='mt-3 d-flex flex-row flex-wrap align-items-center justify-content-center'>
      {discourses.map((item, index) => <CustomDisplayDiscord key={index} item={item} />)}
    </div>
  );
}

export default TopDiscourse;
