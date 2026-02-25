import { useRouter } from 'next/router';
import React from 'react';
import LayoutModal from '../layouts/layoutModal';

const ModalRewardDisable = ({ open, onClose }) => {

  const router = useRouter();

  return (
    <LayoutModal
      isOpen={open}
      title={'You can\'t get claim reward.'}
      onClose={onClose}
    >
      <div className="d-center">

        <p>How can I get reward of Klik?</p>
        <br />
        <div className='text-start color-b -mt-10'>
          - <span className='color-sky cursor-pointer' onClick={() => router.push('/nftmarketplace', undefined, { shallow: true })}>Purchase </span> the NFTs in Marketplace.
          <br />
          - <span className='color-sky cursor-pointer' onClick={() => router.push('/makeNFTs', undefined, { shallow: true })}> Mint </span>
          (not Lazy) new NFTs to get the Rewardable Amount
        </div>
        
      </div>
    </LayoutModal >
  );
};

export default ModalRewardDisable;