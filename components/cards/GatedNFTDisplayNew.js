import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alchemy, Network } from 'alchemy-sdk';
import { useSelector } from 'react-redux';
import CustomPopover from '../custom/CustomPopover';
import { GetLazyMint } from '../../common/api/noAuthApi';
import UtilService from '../../sip/utilService';
import { ALCHEMY_KEY, DEMO_DEFAULT_AVATAR } from '../../keys';

const NFTContent = styled.div`
  width: 80px;
  border-radius: 8px;
  border: 2px solid ${props => props.active ? 'green' : 'red'};
  margin-right: 12px;
  margin-bottom: 6px;
  font-size: 12px;
  overflow: hidden;
  position: relative;

  img {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    margin: 4px;
  }
`

const All = styled.div`
  background: #0d3562;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 11px;
  color: #fff;
  position: absolute;
  right: 2px;
  top: 2px;
`

const And = styled.div`
  width: 30px;
  background: ${props => props.active ? '#0075ff' : '#333'};
  margin-bottom: 3px;
  padding: 1px 2px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Or = styled.div`
  width: 30px;
  background: ${props => props.active ? '#0075ff' : '#333'};
  margin-bottom: 3px;
  padding: 1px 2px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CommunityDisplayNew = ({ data, editable, setAddedNFT }) => {

  const [gatedContents, setGatedContents] = useState([]);
  const { nfts: nfts721 } = useSelector(state => state.nfts);

  const alchemy = new Alchemy({
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  });

  useEffect(() => {
    const onGetActivity = async () => {

      const nftContents = await Promise.all(data.map(async (x) => {
        const isMetasalt = UtilService.checkMetasalt(x.token_address);

        let nft, nft1, nft2;
        if (isMetasalt) {
          nft1 = await GetLazyMint({ token_id: x.token_id });
          nft2 = await nfts721?.find(p => p.token_address === x.token_address && p.token_id === x.token_id)
          nft = nft1 || nft2

          const metaData = JSON.parse(nft?.metadata)
          const image = UtilService.ConvertImg(metaData.image);
          const isVideo = metaData.isVideo
          return nft ? { ...x, image, name: nft.title, isMetasalt, isVideo } : x
        } else {
          nft = await alchemy.nft.getNftMetadata(x.token_address, x.isAll ? '0001' : x.token_id)
          const image = UtilService.ConvertImg(nft.rawMetadata.image);
          const isVideo = nft.rawMetadata.isVideo
          return nft ? { ...x, image, name: nft.title, isMetasalt, isVideo } : x
        }
      }))

      setGatedContents(nftContents);
    }

    onGetActivity().then()
  }, [data, nfts721?.length])

  const onClickAddOr = (index, value) => {
    let myArray = data;
    myArray[index].or = value;
    setAddedNFT([...myArray])
  }

  return (
    <div>
      <div className='text-center title-font'>NFTs</div>

      {gatedContents.length > 0 ?
        <div className='offer-body mt-2'>
          <div className='d-flex flex-row hidden flex-wrap'>
            <div className="d-flex flex-row flex-wrap align-items-center justify-content-center">
              {gatedContents.map((x, index) =>
                <CustomPopover
                  key={index}
                  content={!x.or ? 'Mandatory NFT to access the content' : 'Need at least one NFT to access the content'}
                  placement='bottom'
                >
                  <NFTContent active={x.or}>
                    {!x.isVideo && <picture><img src={x.image || DEMO_DEFAULT_AVATAR} alt='nft image'/></picture>}
                    {x.isVideo && <video src={x.image} preload="auto" autoPlay={true} style={{ height: 70 }}></video>}
                    {x.isAll && <All>All</All>}
                    <div className="text-center overflow-hidden" style={{ maxHeight: 17 }}>{x.name}</div>
                    {editable && <div className='d-flex flex-row align-items-center justify-content-center'>
                      <And active={!x.or} onClick={() => onClickAddOr(index, !x.or)}>And</And>
                      <Or active={x.or} onClick={() => onClickAddOr(index, !x.or)}>Or</Or>
                    </div>}
                  </NFTContent>
                </CustomPopover>
              )
              }
            </div>
          </div>
        </div>
        :
        <div className='text-center text-danger'>No NFTs Added!</div>
      }
    </div>
  );
};

export default CommunityDisplayNew;
