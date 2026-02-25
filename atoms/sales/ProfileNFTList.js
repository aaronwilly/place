import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import NftCard from '../../components/cards/NftCard';
import NFTLoadingCard from '../../components/cards/NFTLoadingCard';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { PROD } from '../../keys';

const ProfileNFTList = ({
  isLoading,
  realData,
  allOrderData,
}) => {

  const { user } = useWeb3Auth()
  const { filter, search } = useSelector(state => state.nfts);
  const { isBig } = filter;
  const { erc721, erc1155, lazyMint, normalMint, searchKey, buynow, cols, brands, eth, matic } = search;

  const requestSearch = {
    allMint: (lazyMint && normalMint) || (!lazyMint && !normalMint),
    type: (erc721 && erc1155) ? 'ERC' : erc721  ? 'ERC721' : erc1155 ? 'ERC1155' : 'ERC',
    searchKey: searchKey || '',
    buynow,
    cols,
    brands,
    net: (eth && matic) ? 'All' : eth ? (PROD ? 'eth' : 'goerli') : matic ? (PROD ? 'polygon' : 'mumbai') : 'All'
  }

  const buynowIDList = useMemo(() => {
    const filtered = allOrderData.filter(item => item?.completed !== true)
    return filtered.map(item => item?.token_id)
  }, [allOrderData])

  const saleCheckDataIds = useMemo(() => {
    const filtered = allOrderData.filter(item => item?.completed === true)
    return filtered.map(item => item?.token_id)
  }, [allOrderData])

  const filterData = realData.filter(item => {
    const network = UtilService.checkNet(item.token_address)
    const { name } = (typeof item.metadata === 'object' ? item.metadata : JSON.parse(item.metadata))
    return  name?.toLowerCase()?.includes(requestSearch.searchKey?.toLowerCase()) && 
    (requestSearch.allMint ? true : lazyMint === item.lazyMint) &&
    (item.contract_type.includes(requestSearch.type)) &&
    (buynow ? buynowIDList.includes(item.token_id) : true) &&
    (requestSearch.net === 'All' ? true : requestSearch.net === network) &&
    (cols?.length > 0 ? cols.includes(item?.collection?._id) : true) &&
    (brands?.length > 0 ? brands.includes(item?.brand?._id) : true)
  })

  const excuteData = filterData?.reduce((filtered, item) => {

    const {
      name = '',
      description = '',
      category = '',
      image = '',
      isVideo,
      animation_url,
      thumbnail: thumb,
    } = (typeof item.metadata === 'object' ? item.metadata : JSON.parse(item.metadata)) || '-';

    const hexTokenId = item.tokenId || item.token_id;
    const myOrderData = allOrderData.find(item => item?.token_id === hexTokenId)
    const newPrice = myOrderData?.price;
    const cImage = UtilService.ConvertImg(item?.image || image);
    const isMetasalt = UtilService.checkMetasalt(item.token_address)
    
    filtered.push({
      newPrice,
      image: UtilService.ConvertImg(animation_url) || cImage,
      category,
      isVideo: (animation_url && animation_url !== image) ? true : isVideo,
      hexTokenId,
      name: name || item?.name || 'NFT',
      description,
      ordering: buynowIDList?.includes(hexTokenId),
      verified: false,
      onsale: saleCheckDataIds?.includes(hexTokenId),
      supply: item.contract_type === 'ERC1155' ? (item.amount || 1) : 0,
      lazyMint: item?.lazyMint,
      isMetasalt,
      token_address: item.token_address,
      thumbnail: UtilService.ConvertImg((animation_url ? cImage : item.thumbnail) || thumb),
      net: item?.net
    })
    return filtered;
  }, []);

  console.log(excuteData[0])

  return (
    <div className='w-100 d-flex flex-wrap align-items-start justify-content-center'>
      {
        isLoading
          ? [...Array(20).keys()].map((c, k) => <NFTLoadingCard key={k} isBig={isBig} />)
          : excuteData.map((item, index) => {
            const {
              name,
              description,
              category,
              image,
              newPrice,
              ordering,
              hexTokenId,
              verified,
              onsale,
              isVideo,
              lazyMint,
              supply,
              isMetasalt,
              token_address,
              thumbnail,
              net,
            } = item;

            return (
              <div key={index}>
                <NftCard
                  nft={{
                    preview_image_url: thumbnail,
                    title: name,
                    price: newPrice,
                    description,
                    lazyMint,
                    ordering,
                    verified,
                    onsale,
                    categoryId: category?.value,
                    isVideo,
                    isMetasalt,
                    token_address,
                    thumbnail,
                    net
                  }}
                  mine={true}
                  big={!isBig}
                  token_id={hexTokenId}
                  supply={supply}
                />
              </div>)
          })}
    </div>
  );
}

export default ProfileNFTList;
