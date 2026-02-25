import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import LayoutPage from '../components/layouts/layoutPage';
import ProfileFilterBar from '../atoms/sales/ProfileFilterBar';
import ProfileLeftMenu from '../atoms/sales/ProfileLeftMenu';
import ProfileNFTList from '../atoms/sales/ProfileNFTList';
import { getAllLikes, getCollections, getOrderData } from '../common/api/authApi';
import { GetNFTsByAddress } from '../common/api/noAuthApi';
import { useWeb3Auth } from '../services/web3auth';
import UtilService from '../sip/utilService';
import { DEMO_AVATAR, PROFILE_BG } from '../keys';

const Pane = styled.div`
  position: absolute; 
  right: 30px; 
  margin-top: 3px;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 20px;
  width: 300px;
`

const MyNFTsPage = ({ allBrands, allCollections, allOrderData }) => {

  const { user } = useWeb3Auth()
  const [realData, setRealData] = useState([])
  const { username, avatar, banner, account, email, } = user || '-'
  const [userLikes, setUserLikes] = useState([])
  const { filter } = useSelector(state => state.nfts)
  const { visible } = filter;

  const follows = useMemo(() => userLikes.filter(item => item?.itemId === account), [userLikes, account])
  const followMe = useMemo(() => userLikes.filter(item => item?.userId === user?._id && item?.itemId === account), [userLikes, user?._id, account])

  useEffect(() => {
    const loadData = async () => {
      const response = await getAllLikes({ follow: true, type: 'user' })
      response && setUserLikes(response)
    }

    loadData().then()
  }, [])

  useEffect(() => {
    const loadMyNFTs = async () => {
      const response = await GetNFTsByAddress({ account })
      response && setRealData(response)
    }

    if (account) {
      loadMyNFTs().then()
    }
  }, [account])

  return (
    <LayoutPage backHidden>

    <div className='position-relative'>
      <div
        className=' breadcumb no-bg'
        style={{ backgroundImage: `url(${UtilService.ConvertImg(banner) || PROFILE_BG})`, backgroundPosition: 'center', padding: 30 }}
      >
        <div className='mainbreadcumb' />
      </div>

      <Pane>
        <div className='d-row justify-content-between'>
          <div>Followers</div>
          <div>{follows.length}</div>
        </div>
        <div className='d-row justify-content-between mt-2'>
          <div>Following</div>
          <div>{followMe.length}</div>
        </div>
        <div className='d-row justify-content-between mt-2'>
          <div>Address</div>
          <div>{UtilService.truncate(account)}</div>
        </div>
      </Pane>

    </div>

    <div className='d-flex flex-column p-5'>

      <div className='profile-avatar'>
        <picture><img src={UtilService.ConvertImg(avatar) || DEMO_AVATAR} alt='avatar' /></picture>
        <br />
      </div>

      <h2 className='color-b'>{username}</h2>
      <div className='color-7'>{email}</div>

    </div>

    <ProfileFilterBar />
    <div className='d-flex flex-row'>
      {visible && <ProfileLeftMenu {...{ allBrands, allCollections }} />}
      <ProfileNFTList {...{ realData, allOrderData }} />
    </div>
  </LayoutPage>
  );
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response1 = await getCollections({})
  const response2 = await getOrderData({})
  // const response3 = await getAllVerifications()

  return {
    props: {
      allCollections: response1 || [],
      allOrderData: response2 || [],
      // allVerifications: response3 || [],
    }
  }
}

export default MyNFTsPage;
