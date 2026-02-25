import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';
import { useDispatch, useSelector } from 'react-redux';
import LayoutPage from '../../components/layouts/layoutPage';
import ProfileLeftMenu from '../../atoms/sales/ProfileLeftMenu';
import ProfileFilterBar from '../../atoms/sales/ProfileFilterBar';
import ProfileNFTList from '../../atoms/sales/ProfileNFTList';
import { useWeb3Auth } from '../../services/web3auth';
import { handleRoute } from '../../common/function';
import { GetAllLikes, GetNFTsByAddress, GetUser } from '../../common/api/noAuthApi';
import { onLikes } from '../../common/web3Api';
import { UploadSVG } from '../../common/svg';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR, PROFILE_BG } from '../../keys';
import LayoutModal from '../../components/layouts/layoutModal';
import { MetaTag } from '../../components/MetaTag';

const Box = styled.div`
  background: ${props => props.follow ? '#fff' : '#222528'};
  color:  ${props => props.follow ? '#333' : '#bbb'};
  border-radius: 16px;
  min-width: auto;
  flex-flow: row nowrap;
  display: flex;
  padding: 8px 18px;
  font-size: 14px;
  transform-origin: center center;
  cursor: pointer;
  margin: 0 7px;
`

const ShareOverlay = styled.div`
  border: 1px solid #333;
  background: #222;
  padding: 12px;
  position: absolute;
  width: 350px;
  border-radius: 8px;
  color: #bbb;
  box-shadow: rgba(0, 0, 0, 0.19) 0 1px 2px, rgba(0, 0, 0, 0.23) 0 4px 3px;
  z-index: 100;
  margin-top: 10px;
  margin-left: -60px;
`
const Pane = styled.div`
  position: absolute; 
  margin-top: 3px;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 20px;
  width: 300px;
  right: 20px;
  top: 310px;
  @media only screen and (max-width: 768px) {
    position: relative; 
    top: -20px;
    right: -30px;
  }
`

const IndividualProfilePage = ({ id, userAgent, allCollections, allBrands, data }) => {

  const dispatch = useDispatch()

  const router = useRouter()
  const [realData, setRealData] = useState([])
  const { filter } = useSelector(state => state.nfts)
  const { visible } = filter;
  const { user, isAuthenticated, allUsers, login } = useWeb3Auth()
  const [isShare, setIsShare] = useState(false);
  const [userLikes, setUserLikes] = useState([])
  const [trigger, setTrigger] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [openAppModal, setOpenAppModal] = useState(false);

  const userInfo = allUsers?.find(item => item?.account === id)
  const { username, avatar, banner, email, account } = userInfo || '-'

  const shareLink = `https://klik.cool/sales/${id}`
  const followers = useMemo(() => userLikes.filter(item => item?.userId === id), [userLikes, id])
  const following = useMemo(() => userLikes.filter(item => item?.likerId === id), [userLikes, id])
  const isFollow = followers.length > 0;
  const allOrderData = [];

  useEffect(() => {
    if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
      setOpenAppModal(true);
    }
  }, [])

  const openApp = () => {
    window.location.href = `metasalt://sales/${id}`;
  };

  const redirectToAppStore = () => {
    if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
      window.location.replace('https://onelink.to/gfnq8n');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const response = await GetAllLikes({ type: 'user', follow: true })
      response && setUserLikes(response)
    }

    loadData().then()
  }, [trigger])

  const loadNFTs = useCallback(async () => {
    if (!id) return false
    setIsLoading(true);
    const response = await GetNFTsByAddress({ account: id })
    response && setRealData(response)
    setIsLoading(false);
  }, [id])

  useEffect(() => {
    loadNFTs().then()
  }, [id, loadNFTs])

  const onFollowUser = async () => {
    const likeData = { userId: id, type: 'user', follow: true, likerId: user?.account, router }
    await dispatch(onLikes(likeData, () => onTrigger()))
  }

  const onMessageMe = async () => {
    if (isAuthenticated) {
      const selectedUser = allUsers?.find(u => account === u.account)
      if (!selectedUser) return;
      handleRoute(router, `/chat?new=${selectedUser.id}`)
    } else {
      login().then()
    }
  }

  const onTrigger = () => setTrigger(trigger + 1)

  const handleOpenApp = () => {
    setOpenAppModal(false);
    if (userAgent.match(/iPhone|iPad|iPod/i)) {
      if (window.navigator.standalone === false) {
        setTimeout(() => redirectToAppStore(), 100);
      }

      const start = Date.now();
      const timeout = 1000;

      openApp();

      setTimeout(() => {
        const elapsed = Date.now() - start;
        if (elapsed < timeout + 20) redirectToAppStore();
      }, timeout);
    }

    if (userAgent.match(/Android/i)) {
      openApp();

      setTimeout(() => {
        if (document.hidden === false) redirectToAppStore();
      }, 2000);
    }
  }

  return (
    <div>
      <MetaTag {...{ title: UtilService.fullName(data), description: data?.account, image: UtilService.ConvertImg(data?.avatar) || DEMO_AVATAR }} />

      <LayoutPage backHidden>

        <div className='position-relative'>
          <div
            className='breadcumb no-bg'
            style={{ backgroundImage: `url(${UtilService.ConvertImg(banner) || PROFILE_BG})`, backgroundPosition: 'center', padding: 30 }}
          >
            <div className='mainbreadcumb' />
          </div>

        </div>

        <div className='d-flex flex-column p-5'>

          <div className='profile-avatar'>
            <picture><img src={UtilService.ConvertImg(data?.avatar) || DEMO_AVATAR} alt='avatar' /></picture>
            <br />
          </div>

          <h2 className='color-b'>{UtilService.fullName(data)}</h2>
          <div className='color-7'>{email}</div>

        </div>

        <Pane>
          <div className='d-flex flex-row justify-content-between'>
            <div>Followers</div>
            <div>{followers.length}</div>
          </div>
          <div className='d-flex flex-row justify-content-between mt-2'>
            <div>Following</div>
            <div>{following.length}</div>
          </div>
          <div className='d-flex flex-row justify-content-between mt-2'>
            <div>Address</div>
            <div>{UtilService.truncate(id)}</div>
          </div>
        </Pane>

        <div className='flex d-row' style={{ marginLeft: 25 }}>
          <Box follow={isFollow} onClick={onFollowUser}>{isFollow ? 'Unfollow' : 'Follow'}</Box>
          <Box onClick={onMessageMe}>Message</Box>
          <div>
            <Box onClick={() => setIsShare(true)}>
              <UploadSVG />
            </Box>
            {isShare &&
              <OutsideClickHandler onOutsideClick={() => setIsShare(false)}>
                <ShareOverlay>
                  <div className='mb-3 fs-24 text-center'>Share link to this page</div>
                  <div className='fs-12 d-flex flex-row justify-content-between'>
                    <div><WhatsappShareButton url={shareLink}><WhatsappIcon size={25} round /> Whatsapp</WhatsappShareButton></div>
                    <div><TwitterShareButton url={shareLink}><TwitterIcon size={25} round /> Twitter</TwitterShareButton></div>
                    <div><FacebookShareButton url={shareLink}><FacebookIcon size={25} round /> Facebook</FacebookShareButton></div>
                    <div><LinkedinShareButton url={shareLink}><LinkedinIcon size={25} round /> Linkedin</LinkedinShareButton></div>
                    <div><EmailShareButton url={shareLink}><EmailIcon size={25} round /> Email</EmailShareButton></div>
                  </div>
                </ShareOverlay>
              </OutsideClickHandler>
            }
          </div>

        </div>

        <ProfileFilterBar onRefresh={loadNFTs} />
        <div className='d-flex flex-row'>
          {visible && <ProfileLeftMenu {...{ allBrands, allCollections }} />}
          <ProfileNFTList {...{ isLoading, realData, allOrderData }} />
        </div>
      </LayoutPage>

      <LayoutModal
        isOpen={openAppModal}
        title='Do you want to open this page in the app?'
        hiddenClose={true}
      >
        <div className='w-100' style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div className='offer-btn bg-primary color-white' onClick={() => setOpenAppModal(false)}>No</div>
          <div className='offer-btn bg-primary color-white' onClick={() => handleOpenApp()}>Yes</div>
        </div>
      </LayoutModal>
    </div>
  );
}

export const getServerSideProps = async ({ res, req, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

  const { id } = query

  const response = await GetUser({ account: id })

  return {
    props: {
      id,
      userAgent,
      data: response
      // allCollections: response?.collections || [],
      // allOrderData: response?.orderData || [],
      // allVerifications: response?.verifications || [],
      // allBrands: response?.brands || [],
    }
  }
}

export default IndividualProfilePage;
