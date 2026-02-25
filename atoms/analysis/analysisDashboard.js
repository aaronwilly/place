import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import NftCard from '../../components/cards/NftCard';
import CardCommunity from '../../components/cards/CardCommunity';
import UtilService from '../../sip/utilService';
import { Title } from '../../constants/globalCss';

const CTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
`

const Box = styled.div`
  margin: 40px 10px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const AnalysisDashboard = ({ orderData = [], communities = [] }) => {

  const { nfts } = useSelector(state => state.nfts)

  const filteredCommunities = communities.slice(0, 12).filter((x, i) => i < 3)

  const NFTs = nfts.reduce(function (filtered, item) {
    if (item.metadata) {
      filtered.push(item)
    }
    return filtered
  }, []).filter((x, i) => i < 3)

  return (
    <div>
    <Title>Klik Dashboard</Title>
      <Box>
        <CTitle>Top NFTs</CTitle>
      </Box>
      <div className='d-flex flex-row flex-wrap overflow-hidden'>
        {NFTs.map((item, index) => {

            const { image, price, category, isVideo, name } = JSON.parse(item.metadata);
            const mOrderData = orderData.length > 0 && orderData.find(datum => datum?.token_id === item.token_id);
            const token_address = item.token_address;
            const isMetasalt = UtilService.checkMetasalt(token_address)

            return (
              <div key={index}>
                <NftCard
                  nft={{
                    preview_image_url: UtilService.ConvertImg(image),
                    title: name,
                    price: mOrderData?.price || price,
                    description: 'Klik Token ',
                    lazyMint: item?.lazyMint,
                    categoryId: category?.value,
                    isVideo,
                    isMetasalt,
                    token_address,
                    thumbnail: UtilService.ConvertImg(item?.thumbnail)
                  }}
                  big={true}
                  token_id={item.token_id}
                  favHidden={true}
                />
              </div>)
          })
        }
      </div>

      <Box>
        <CTitle>Top Communities</CTitle>
      </Box>

      <div className='d-flex flex-row flex-wrap overflow-hidden'>
        {filteredCommunities.map((item, index) => <CardCommunity key={index} community={item} />)}
      </div>
    </div>
  );
};

export default AnalysisDashboard;
