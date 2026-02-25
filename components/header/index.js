import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { toast, ToastContainer } from 'react-toastify';
import { getMessaging, onMessage } from 'firebase/messaging';
import { firebaseCloudMessaging } from '../../firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { updateLeftSidebar, updateRightSidebar } from '../../store/actions/settings/settings';
import { addNotification, updateBadgeCount } from '../../store/actions/notifications/notifications';
import HeaderSearch from './HeaderSearch';
import LayoutModal from '../layouts/layoutModal';
import CustomPopover from '../custom/CustomPopover';
import useWindowSize from '../../hooks/useWindowSize';
import { useWeb3Auth } from '../../services/web3auth';
import { loginToBackend } from '../../common/api/noAuthApi';
import { updateFcmToken } from '../../common/api/authApi';
import { handleRoute } from '../../common/function';
import { IcFav, IcLogin, IcStream } from '../../common/icons';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR } from '../../keys';

const Container = styled.div`
  width: 100%;
  position: fixed;
  z-index: 100;

  @media only screen and (max-width: 600px) {
    box-shadow: -2px 3px 4px 0 rgba(0, 0, 0, 0.75);
  }
`

const HeaderBox = styled.div`
  background: #222528;
  padding: 0 30px 0 0;
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media only screen and (max-width: 600px) {
    height: 56px;
    padding: 0 20px 0 0;
  }
`;

const Heading = styled.div`
  margin-left: 170px;
  display: flex;
  flex: 1;

  @media only screen and (max-width: 1200px) {
    margin-left: 12px;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const UnReadBadge = styled.div`
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 10px;
`

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`

const PopBox = styled.div`
  min-width: 200px;
  background: #222;
  border: 2px solid #222;
  padding: 16px;
  color: #999;
  box-shadow: 1px 1px 3px #333;
  position: absolute;
  top: 60px;
  right: 40px;
`

const IMG = styled.img`
  width: 50px;

  @media only screen and (max-width: 600px) {
    width: 30px;
  }
`

const HeaderDefaultIcons = [
  { content: 'Following', icon: '/img/icons/ic_crown.png', alt: 'Following', router: '/following' },
  { content: 'Authentication', icon: '/img/icons/ic_verify.png', alt: 'Authentication', router: '/authentication' },
  { content: 'Ethereum/BTC', icon: '/img/icons/ic_swap.png', alt: 'Ethereum', router: '/buyethereum' },
  { content: '$Klik', icon: '/img/icons/ic_meta.png', alt: 'Klik', router: '/$metasalttokens' },
  // { content: 'History', icon: '/img/icons/ic_notification.png', alt: 'History', router: '/history' },
];

const Header = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, balance, chain, setUser, login, logout } = useWeb3Auth()
  const { width } = useWindowSize()

  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [payloadData, setPayloadData] = useState(null)
  const [isPopUpProfile, setIsPopUpProfile] = useState(false)
  const [isPopUpCreator, setIsPopUpCreator] = useState(false)

  const pathname = router.pathname
  const { badgeCount } = useSelector(state => state.notifications)
  const isMobile = useMemo(() => width < 600, [width])
  const isDisableHeader = UtilService.disableHeader(pathname)

  if (mounted) {
    const messaging = getMessaging()
    onMessage(messaging, (payload) => {
      setPayloadData(payload.data)
      toast(payload.notification.body.split('<a')[0], {
        icon: () => <picture><img src={payload?.data?.image || '/img/logo.png'} alt='' width={40} height={40} className='br-50' /></picture>
      });
      dispatch(updateBadgeCount(badgeCount + 1))
    });
  }

  useEffect(() => {
    firebaseCloudMessaging.init().then()
    const setToken = async () => {
      const token = await firebaseCloudMessaging.tokenInLocalforage()
      token && setMounted(true)
    };

    setToken().then()
  }, []);

  useEffect(() => {
    const handleFcmToken = async () => {
      try {
        const token = await firebaseCloudMessaging.tokenInLocalforage();
        console.log('handleFcmToken token ======>', token);
        if (user?._id) await updateFcmToken({ _id: user?._id, web: token });
      } catch (e) {
        console.log('handleFcmToken catch =====>', e);
      }
    }

    if (user) handleFcmToken().then();
  }, [user, dispatch])

  useEffect(() => {
    if (!isMobile) {
      dispatch(updateLeftSidebar(true))
      dispatch(updateRightSidebar(true))
    } else {
      dispatch(updateLeftSidebar(false))
      dispatch(updateRightSidebar(false))
    }
  }, [isMobile, dispatch])

  useEffect(() => window.scrollTo(0, 0), [pathname])

  const handleLogin = async () => {
    const loginUser = await login()

    if (loginUser?.account) {
      const response = await loginToBackend(loginUser)
      localStorage.setItem('accessToken', response.accessToken)
      if (response?.data?.deleted) {
        await logout()
        dispatch(addNotification('Your account has been temporarily blocked. Please contact our support team at support@metasalt.io for further assistance.', 'error'))
        handleRoute(router, '/')
      } else {
        setUser(response?.data)
        if (response?.data?.firstLogin) {
          setIsFirstLogin(true)
        } else {
          dispatch(addNotification('Welcome Back!', 'success'))
        }
      }
    }
  }

  const handleLogOut = async () => {
    await logout()
    setUser(null)
    handleRoute(router, '/')
    dispatch(addNotification('Log out successful', 'success'))
  }

  const onToastClicked = () => {
    if (payloadData && payloadData.type === 'chat') {
      handleRoute(router, `/chat?new=${payloadData?.sendUserId}`)
    }
  }

  const handlePopUpProfile = (path) => {
    setIsPopUpProfile(false)
    if (path === 'https://academy.metasalt.io/') {
      typeof window !== 'undefined' && window.open(path, '_blank')
    } else {
      handleRoute(router, path)
    }
  }

  const handlePopUpCreator = (path) => {
    setIsPopUpCreator(false)
    handleRoute(router, path)
  }

  return (
    <Container style={{ display: isDisableHeader && 'none' }}>
      <ToastContainer autoClose={5000} onClick={onToastClicked} />
      <HeaderBox>
        <Link href='/' prefetch={false}>
          <div className='cursor-pointer d-flex align-items-center justify-content-center' style={{ width: isMobile ? 50 : 80, height: 80 }}>
            <IMG src={IcFav.src} alt='logo' />
          </div>
        </Link>

        <Heading>
          {width > 600 && <HeaderSearch />}
        </Heading>

        <Row>
          <CustomPopover content='Create' placement='bottom'>
            <picture>
              <img src='/img/icons/ic_creator.png' alt='following' className='cursor-pointer' style={{ width: 22, marginRight: 12 }} onClick={() => setIsPopUpCreator(true)} />
            </picture>
          </CustomPopover>

          {isAuthenticated && HeaderDefaultIcons.map((item, index) => (
            <CustomPopover key={index} content={item.content} placement='bottom'>
              <div className='position-relative'>
                <picture>
                  <img src={item.icon} alt={item.alt} className='cursor-pointer' style={{ width: 22, marginRight: 12 }} onClick={() => handleRoute(router, item.router)} />
                </picture>
                {item.content === 'History' && badgeCount > 0 && <UnReadBadge />}
              </div>
            </CustomPopover>
          ))}

          {isAuthenticated &&
            <Avatar src={UtilService.ConvertImg(user?.avatar || DEMO_AVATAR)} alt='profile' className='cursor-pointer' onClick={() => setIsPopUpProfile(true)} />
          }

          {!isAuthenticated &&
            <CustomPopover content='Login' placement='bottom'>
              <picture>
                <img src={IcLogin.src} alt='login' className='cursor-pointer' style={{ width: 22 }} onClick={handleLogin} />
              </picture>
            </CustomPopover>
          }
        </Row>

        {isPopUpProfile && isAuthenticated &&
          <OutsideClickHandler onOutsideClick={() => setIsPopUpProfile(false)}>
            <PopBox style={{ marginTop: isMobile ? -10 : 0 }}>
              <div className='d-flex flex-row align-items-center'>
                <picture>
                  <img src={UtilService.ConvertImg(user?.avatar) || DEMO_AVATAR} alt='' style={{ width: 42, height: 42, borderRadius: 21, marginRight: 6 }} />
                </picture>
                <div>
                  <div>{user?.username}</div>
                  <div style={{ color: '#e5e510', fontSize: 14 }}>{UtilService.truncate(user?.account)}</div>
                </div>
              </div>

              <div className='mt-2'>My Balance: {(parseFloat(balance)).toFixed(6)}</div>
              <div>Network: {chain}</div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/stripe')}>
                <AttachMoneyIcon sx={{ color: '#fff' }} />
                <span style={{ marginLeft: 8 }}>Buy KlikCoins</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/reward')}>
                <Image src='/img/icons/ic_reward.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Reward</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/analysis')}>
                <Image src='/img/icons/history.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Analysis</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/mycommunities')}>
                <Image src='/img/icons/ic_people.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Communities</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/myvideos')}>
                <Image src='/img/icons/ic_video.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Videos</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/mymusic')}>
                <Image src='/img/icons/ic_music.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Music</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/mydiscourse')}>
                <Image src='/img/icons/ic_discord.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Discourse</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/mynfts')}>
                <Image src='/img/icons/nft.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>NFTs</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('/settings')}>
                <Image src='/img/icons/ic_settings.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Settings</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpProfile('https://academy.metasalt.io/')}>
                <Image src='/img/icons/ic_academy.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Academy</span>
              </div>

              <div className='mt-1 cursor-pointer d-flex flex-row align-items-center' onClick={handleLogOut}>
                <Image src='/img/icons/ic_logout.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Log Out</span>
              </div>
            </PopBox>
          </OutsideClickHandler>
        }

        {isPopUpCreator &&
          <OutsideClickHandler onOutsideClick={() => setIsPopUpCreator(false)}>
            <PopBox style={{ right: isAuthenticated ? 120 : 20, marginTop: isMobile ? -10 : 0 }}>

              <div className='mt-2 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpCreator('/makeNFTs')}>
                <Image src='/img/icons/nft.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>NFTs</span>
              </div>

              <div className='mt-2 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpCreator('/createNFTcommunities')}>
                <Image src='/img/icons/ic_people.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Communities</span>
              </div>

              <div className='mt-2 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpCreator('/create/brand')}>
                <Image src='/img/icons/ic_brand.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Brands</span>
              </div>

              <div className='mt-2 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpCreator('/create/collection')}>
                <Image src='/img/icons/ic_col.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Collections</span>
              </div>

              <div className='mt-2 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpCreator('/livestream/create')}>
                <Image src={IcStream} alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Live Stream</span>
              </div>

              <div className='mt-2 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpCreator('/create/video')}>
                <Image src='/img/icons/ic_video.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Videos</span>
              </div>

              <div className='mt-2 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpCreator('/create/music')}>
                <Image src='/img/icons/ic_music.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Music</span>
              </div>

              <div className='mt-2 cursor-pointer d-flex flex-row align-items-center' onClick={() => handlePopUpCreator('/create/discourse')}>
                <Image src='/img/icons/ic_discord.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Discourse</span>
              </div>
            </PopBox>
          </OutsideClickHandler>
        }
      </HeaderBox>
      <LayoutModal
        isOpen={isFirstLogin}
        title='Please fill out the rest of your profile'
        onRequestClose={() => setIsFirstLogin(false)}
        onClose={() => setIsFirstLogin(false)}
      >
        <div className='w-100 d-flex justify-content-center'>
          <div className='btn-main' onClick={() => { setIsFirstLogin(false); handleRoute(router, '/settings') }}>Ok</div>
        </div>
      </LayoutModal>
    </Container>
  );
}

export default Header;
