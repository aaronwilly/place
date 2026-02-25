import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import NftCard from '../../components/cards/NftCard';
import UtilService from '../../sip/utilService';

const NFTMarketplace = ({ orderData }) => {

  const { nfts } = useSelector(state => state.nfts)

  return (
    <div className='nft d-flex flex-row flex-wrap align-items-center justify-content-center'>
      {nfts.filter(({ _ }, index) => index < 6).map((item, index) => {
        if (!item.metadata) {
          return null
        }
        const { image, price, category, isVideo, name } = JSON.parse(item.metadata);
        const mOrderData = orderData.length > 0 && orderData.find(x => x?.tokenId === item.token_id);
        const token_address = item.token_address;
        const isMetasalt = UtilService.checkMetasalt(item.token_address);

        return (
          <div key={index}>
            <NftCard
              nft={{
                preview_image_url: image,
                title: name,
                price: mOrderData?.price || price,
                description: 'Klik Token ',
                lazyMint: item?.lazyMint,
                categoryId: category?.value,
                isVideo,
                isMetasalt,
                token_address
              }}
              big={true}
              token_id={item.token_id}
              favHidden={true}
            />
          </div>
        )
      })}
    </div>
  );
}

export default memo(NFTMarketplace);
