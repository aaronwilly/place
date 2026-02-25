import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowSize';
import UtilService from '../sip/utilService';

const MyFooter = styled.div`
  background: #222528;
  margin-top: 30px;
  padding: 30px;
  color: #ddd;

  @media only screen and (max-width: 600px) {
    padding: 0 6px 12px;
  }
`

const Title = styled.div`
  font-family: 'Ramabhadra', sans-serif;
  color: #eee;
  font-size: 21px;
  margin-bottom: 12px;
  margin-top: 30px;
  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin-bottom: 4px;
    margin-top: 20px;
  }
`

const Text = styled.div`
  font-size: 15px;
  cursor: pointer;
  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const Footer = () => {

  const { width } = useWindowSize();
  const router = useRouter();
  const pathname = router.pathname

  const isDisable = UtilService.disableHeader(pathname);
  const isMobile = width < 600;

  if (isDisable) {
    return false;
  }

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  return (
    <MyFooter className="row d-center">
      <div className={`row col-md-${width > 700 ? 10 : 12}`}>
        <div className='col-md-4'>
          <img src='/img/round.png' style={{ width: 120, marginTop: 42 }} />
          <Text style={{ cursor: 'auto', marginTop: 32 }}>The world’s digital marketplace for crypto collectibles and non-fungible tokens (KilkPass). Buy, sell, and discover exclusive digital items.</Text>
        </div>
        <div className='col-md-8'>
          <div className='row'>
            <div className='offset-lg-2 offset-md-1 col-xs-6 col-md-4 col-lg-2 '>
              <Title>Explore</Title>
              {/* <Text onClick={() => handleRouters('/nftcommunities')}>Communities</Text> */}
              <Text onClick={() => handleRouters('/videos')}>Videos</Text>
              {/* <Text onClick={() => handleRouters('/music')}>Music</Text> */}
              {/* <Text onClick={() => handleRouters('/discourse')}>Discourse</Text> */}
            </div>
            <div className='col-xs-6 col-md-4 col-lg-2 '>
              <Title>Marketplace</Title>
              <Text onClick={() => handleRouters('/nftmarketplace')}>Popular Keys</Text>
              <Text onClick={() => handleRouters('/feed')}>Feeds</Text>
            </div>
            <div className='col-xs-6 col-md-4 col-lg-2 '>
              <Title>Category</Title>
              <Text onClick={() => handleRouters('/collection/art')}>Art</Text>
              <Text onClick={() => handleRouters('/collection/boats')}>Boats</Text>
              <Text onClick={() => handleRouters('/collection/cars')}>Cars</Text>
              <Text onClick={() => handleRouters('/collection/fashion')}>Fashion</Text>
              <Text onClick={() => handleRouters('/collection/jewelry')}>Jewelry</Text>
              <Text onClick={() => handleRouters('/collection/planes')}>Planes</Text>
              <Text onClick={() => handleRouters('/collection/realEstate')}>Real Estate</Text>
              <Text onClick={() => handleRouters('/collection/watches')}>Watches</Text>
              <Text onClick={() => handleRouters('/collection/wine')}>Wine</Text>
              <Text onClick={() => handleRouters('/collection/event')}>Event</Text>
              <Text onClick={() => handleRouters('/collection/certifications')}>Certifications</Text>
              <Text onClick={() => handleRouters('/collection/electronics')}>Electronics</Text>
            </div>
            <div className='col-xs-6 col-md-4 col-lg-2 '>
              <Title>Social</Title>
              {
                socials.map((item, index) => <Link href={item.link} key={index}>
                  <a target='_blank' rel="noopener" className={!item.link ? 'btn-disabled' : 'hover-white'}>
                    <Text>{item.title}</Text>
                  </a>
                </Link>)
              }
            </div>
            <div className='col-xs-6 col-md-4 col-lg-2'>
              <Title>ToS</Title>
              <Text onClick={() => handleRouters('/termsOfService')}>Terms of Service</Text>
              <Text onClick={() => handleRouters('/privacy')}>Privacy</Text>
            </div>
          </div>
        </div>
      </div>

      <div className='row col-md-10 mt-5 pt-4 pb-2' style={{ borderTop: '1px solid #fff' }}>
        <div className={width > 600 ? 'fs-16 text-start' : 'fs-13 text-center'}>© 2024 Klik, Inc</div>
      </div>

    </MyFooter>
  )
};

export default Footer;

const socials = [
  { title: 'App Store', link: 'https://apps.apple.com/ph/app/klik-social/id6471041690?platform=iphone', },
  { title: 'Google Play', link: 'https://play.google.com/store/apps/details?id=com.klikmobile' },
  { title: 'TikTok', link: 'https://www.tiktok.com/@metasalt.io' },
  { title: 'Youtube', link: 'https://www.youtube.com/watch?v=qHTp3KuefiE&ab_channel=KLIK' },
  { title: 'Twitter', link: 'https://twitter.com/metasalt_io' },
  { title: 'Instagram', link: 'https://www.instagram.com/metasalt.io/' },
];