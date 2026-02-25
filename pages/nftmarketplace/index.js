import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onEmptySearch } from '../../store/actions/nfts/nfts';
import LayoutPage from '../../components/layouts/layoutPage';
import ProfileLeftMenu from '../../atoms/sales/ProfileLeftMenu';
import ProfileNFTList from '../../atoms/sales/ProfileNFTList';
import ProfileFilterBar from '../../atoms/sales/ProfileFilterBar';
import { MetaTag } from '../../components/MetaTag';
import { GetAllLazyMints, GetAllNFTs, GetNFTMarketplacePageData } from '../../common/api/noAuthApi';
import { DESCRIPTION } from '../../keys';

const NftMarketplace = ({ allBrands, allCollections, allOrderData }) => {

  const dispatch = useDispatch()
  // const [page, setPage] = useState(0)
  // const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [realData, setRealData] = useState([])

  const { filter } = useSelector(state => state.nfts)
  const { visible } = filter;

  useEffect(() => {
    const loadAllNFTS = async () => {
      setIsLoading(true)
      const response = await GetAllNFTs();
      response && setRealData(response)
      // response && setCount(response.length)
      setIsLoading(false)
      dispatch(onEmptySearch())
    }

    loadAllNFTS().then()
  }, [])

  const onGetLoadMoreNFTs = useCallback(async (x) => {
    setIsLoading(true)

    const response = await GetAllLazyMints()
    if (response) {
      setRealData(x === 0 ? response : [...realData, ...response])
      // setCount(response.length)
      // setPage(x)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    setRealData([])
    onGetLoadMoreNFTs(0).then()
  }, [onGetLoadMoreNFTs])


  return (
    <div>
      <MetaTag
        {...{
          title: 'Klik Buy/Sell',
          description: DESCRIPTION,
          image: 'https://ucarecdn.com/1bd723ba-565e-4e85-913b-4fc06751746f/Screenshot_1.png',
        }}
      />
      <LayoutPage backHidden>
        <h1 className='m-5'>Buy / Sell</h1>
        <ProfileFilterBar />
        <div className='d-flex flex-row'>
          {visible && <ProfileLeftMenu {...{ allBrands, allCollections }} />}
          <ProfileNFTList {...{ isLoading, realData, allOrderData }} />
        </div>
      </LayoutPage>
    </div>
  );
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response = await GetNFTMarketplacePageData()

  return {
    props: {
      // allBrands: response?.brands || [],
      // allCollections: response?.collections || [],
      allOrderData: response?.orderData || [],
      // allVerifications: response?.verifications || [],
    }
  }
}

export default NftMarketplace;
