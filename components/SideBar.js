import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowSize';
import { useWeb3Auth } from '../services/web3auth';
import UtilService from '../sip/utilService';
import { handleRoute } from '../common/function';
import {
  IcAndroid,
  IcChat,
  IcChatGPT,
  IcFeed,
  IcInstagram,
  IcInvite,
  IcIos,
  IcNFT,
  IcStream,
  IcTiktok,
  IcTwitter,
  IcVideo,
  IcYoutube,
  IcIco,
  IcDownload
} from '../common/icons';

const Container = styled.div`
  width: ${props => props.disabled ? 0 : (props.opened ? 200 : 70)}px;
  height: 100vh;
  max-height: calc(100% - 75px);
  background: #222528;
  margin-top: 75px;
  overflow: auto;
  transition: all 0.3s ease-in-out;
  box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.75);
  position: fixed;
  z-index: 10;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 600px) {
    max-height: calc(100% - 40px);
    margin-top: 40px;
  }
`;

const Row = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-left: ${props => props.opened ? 13 : 0}px;
  cursor: pointer;
  display: flex;
  flex-direction: ${props => props.opened ? 'row' : 'column'};
  align-items: center;

  img {
    max-width: 21px;
    max-height: 21px;
  }
`;

const Title = styled.p`
  margin-top: 20px;
  margin-bottom: 8px;
  margin-left: ${props => props.opened ? 12 : 0}px;
  font-family: 'Inter', sans-serif;
  font-size: ${props => props.opened ? 12 : 12}px;
  color: #fff;
  text-align: ${props => props.opened ? 'left' : 'center'};
  text-transform: uppercase;
`;

const Note = styled.div`
  margin-left: ${props => props.opened ? 12 : 0}px;
  font-size: ${props => props.opened ? 16 : 0}px;
  font-weight: 400;
  color: #B5B5BE;
  text-align: center;
`;

const Social = styled.div`
  width: ${props => props.opened ? 92 : 30}px;
  border: 1px solid #555;
  border-radius: 4px;
  margin: 2px;
  padding: 5px 3px;
  font-size: ${props => props.opened ? 11 : 0}px;
  color: #999;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;

  div {
    margin-left: 5px;
  }

  img {
    max-width: 21px;
    max-height: 21px;
  }

  &:hover {
    background: #111;
  }
`
const UsersIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 20px;
  margin-top: 55px;
  color: #fff;
  transition: all 0.3s ease-in-out;
  box-shadow: -2px 3px 4px 0 rgba(0, 0, 0, 0.75);
  position: fixed;
  left: 5px;
  bottom: 6px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;  
`

const SideBar = () => {

  const router = useRouter()
  const { isAuthenticated } = useWeb3Auth()
  const { width } = useWindowSize()
  const [initialHover, setInitialHover] = useState(false)

  const { pathname } = router;
  const isDisable = UtilService.disableHeader(pathname);
  const isMobile = width < 600;

  if (isDisable) {
    return false;
  }

  const uiOpened = isMobile ? true : initialHover;

  return (
    <div className='position-relative'>
      <UsersIcon onClick={() => setInitialHover(true)}>
        <span className='icon_menu fs-24' />
      </UsersIcon>

      <Container
        opened={uiOpened}
        disabled={isMobile && !initialHover}
        onMouseOver={() => setInitialHover(true)}
        onMouseLeave={() => setInitialHover(false)}
      >
        {isMobile && <span className='icon_close mr-2 fs-20 color-white position-absolute' style={{ right: 0, top: 18 }} onClick={() => setInitialHover(false)} />}

        {MENU.map((item, index) => {
          if (!isAuthenticated && item.auth) {
            return null
          }
          return (
            <div key={index}>
              <Title opened={uiOpened}>{item.title}</Title>
              {item.contents.map((x, key) => {
                if (!isAuthenticated && x.auth) return false;
                return (
                  <Row key={key} opened={uiOpened} onClick={() => x.href ? window.open(x.href, '_blank') : handleRoute(router, x.link)}>
                    <picture>
                      <img src={x.icon.src} alt='icon' width={21} height={21} />
                    </picture>
                    <Note opened={uiOpened}>{!uiOpened ? (x.mTitle || x.title) : x.title}</Note>
                  </Row>
                )
              })}
            </div>
          )
        })}
        <div className='f-1' />

        <div className='d-flex flex-row flex-wrap justify-content-center'>
          {socials.map((item, index) =>
            <Link href={item.link} key={index}>
              <a target='_blank' rel="noopener" className={!item.link ? 'btn-disabled' : ''}>
                <Social opened={uiOpened}>
                  <picture>
                    <img src={item.icon.src} alt='icon' width={20} height={20} />
                  </picture>
                  <div>{item.title}</div>
                </Social>
              </a>
            </Link>
          )}
        </div>
        {/* <Version onClick={() => handleRoute(router, '/')}>Go to Landing</Version> */}
      </Container>
    </div>
  )
};

export default SideBar;

const socials = [
  { icon: IcIos, title: 'iOS App', link: 'https://apps.apple.com/ph/app/klik-social/id6471041690?platform=iphone', },
  { icon: IcAndroid, title: 'Android', link: 'https://play.google.com/store/apps/details?id=com.klikmobile' },
  { icon: IcTiktok, title: 'TikTok', link: 'https://www.tiktok.com/@metasalt.io' },
  { icon: IcYoutube, title: 'Youtube', link: 'https://www.youtube.com/watch?v=qHTp3KuefiE&ab_channel=METASALT' },
  { icon: IcTwitter, title: 'Twitter', link: 'https://twitter.com/metasalt_io' },
  { icon: IcInstagram, title: 'Instagram', link: 'https://www.instagram.com/metasalt.io/' },
];

const MENU = [
  {
    title: 'Explore',
    contents: [
      { icon: IcVideo, title: 'Videos', link: '/videos' },
      { icon: IcDownload, title: 'Download', link: '/download' },
      { icon: IcIco, title: 'ICO', mTitle: 'Dis', link: '/ico' },

      // { icon: IcPeople, title: 'Communities', mTitle: 'Gate', link: '/nftcommunities' },
      { icon: IcChat, title: 'Chat', link: '/chat', auth: true },
      { icon: IcStream, title: 'LiveStream', link: '/livestream', auth: true },

    ],
  },
  {
    title: 'Market',
    contents: [
      { icon: IcNFT, title: 'Popular Keys', link: '/nftmarketplace' },
      { icon: IcFeed, title: 'Feed', link: '/feed' },
      { icon: IcInvite, title: 'Invite Friends', link: '/invite', auth: true },
      { icon: IcChatGPT, title: 'ChatGPT', link: '/chatGPT' },
    ],
  },
];
