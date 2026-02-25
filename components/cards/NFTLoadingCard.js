import React, { memo } from 'react';
import clsx from 'clsx';
import Skeleton from 'react-loading-skeleton';

const NFTLoadingCard = ({ isBig }) => {

  return (
    <div className={clsx(isBig ? 'nft-card-big' : 'nft-card')} style={{ height: 'auto' }}>

      <div className='p-2'>

        <Skeleton height={190} />

      </div>


      <div style={{ background: '#191c1f', padding: 12, color: '#bbb' }}>

        <Skeleton height={30} />

        <Skeleton height={20} width={120} />

      </div>

    </div>
  );
};

export default memo(NFTLoadingCard);        
