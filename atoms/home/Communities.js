import React from 'react';
import CardCommunity from '../../components/cards/CardCommunity';

const Communities = ({ communities = [] }) => {
  return (
    <div className='d-flex flex-row flex-wrap justify-content-center'>
      {communities.map((item, index) => <CardCommunity key={index} community={item} />)}
    </div>
  );
}

export default Communities;
