import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { Fade } from 'react-awesome-reveal';
import LayoutPage from '../components/layouts/layoutPage';
import { MetaTag } from '../components/MetaTag';
import useWindowSize from '../hooks/useWindowSize';
import { handleRoute } from '../common/function';
import { IcLogo } from '../common/icons';
import { DESCRIPTION, TITLE, VERSION } from '../keys';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  article {
    margin-top: 40px;
  }
  
  span {
    font-size: 50px;
    color: #bbb;
    text-align: center;
    line-height: 60px;
  }
  
  p {
    margin-bottom: 20px;
    font-size: 16px;
    text-align: center;
  }
  
  @media only screen and (max-width: 600px) {
    margin: 0 12px 0 0;
    text-align: center;
    
    article {
      margin-bottom: 15px;
    }
    
    span {
      font-size: 28px;
      line-height: 28px;
    }
    
    p {
      margin-top: -15px;
      font-size: 12px;
    }
  }
`

const Square = styled.div`
  border: 1px solid #777;
  border-radius: 6px;
  padding: 8px 12px;
  color: #bbb;
`

const Divider = styled.div`
  margin: 100px 0;
  
  @media only screen and (max-width: 600px) {
    margin: 20px 0;
  }
`

const Card = styled.div`
  max-width: 400px;
  background: #1b1b1b;
  border: 1px solid #272727;
  border-radius: 12px;
  margin: 11px 0;
  padding: 22px;
  
  div {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }
  
  p {
    margin-top: 6px;
    margin-bottom: 0;
    font-size: 14px;
  }
`

const Logo = styled.div`
  position: absolute;
  top: 0;
  left: 30px;
`

const Version = styled.div`
  font-size: 12px;
  color: #777;
  cursor: pointer;
  position: fixed;
  bottom: 10px;
  left: 10px;
`

const Video = styled.video`
  width: 80%;
  border-radius: 20px;
  margin-top: 50px;
  
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`

const Gif = styled.img`
  width: 70%;
  border-radius: 20px;
  
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`

const Landing = () => {

  const router = useRouter()
  const { width } = useWindowSize()

  const isMobile = width < 600

  return (
    <div>
      <MetaTag
        {...{
          title: TITLE,
          description: DESCRIPTION,
          image: 'https://ucarecdn.com/1bd723ba-565e-4e85-913b-4fc06751746f/Screenshot_1.png',
        }}
      />
      <LayoutPage backHidden>
        <Logo>
          <picture>
            <img src={IcLogo.src} alt='logo' width={isMobile ? 50 : 120} />
          </picture>
        </Logo>

        <Version>{VERSION}</Version>

        <div className='mt-5 container'>
          <div className='row'>
            <Divider />
            <Fade direction='down' className='col-lg-12 mt-3'>
              <Box>
                <article>
                  <span>Anyone can be a creator.</span>
                </article>
                <p className='color-b'>Klik makes it easy to create, sell, and manage the NFTs without any risks.</p>
                <div className='mt-5 btn btn-primary' onClick={() => handleRoute(router,'/')}>Go to Dashboard</div>
              </Box>
            </Fade>

            <Divider />
            <div className='mt-5 d-flex align-items-center justify-content-center'>
              <Video loop controls preload='auto' autoPlay={true}>
                <source src={'img/other/video.mp4'} type='video/mp4' />
                Your browser does not support playing this Video
              </Video>
            </div>

            <Divider />
            <div className='mt-5 row align-items-center'>
              <Fade direction='left' className='col-lg-6 mt-5'>
                <Gif src='img/m.gif' alt='gif' />
              </Fade>

              <Fade direction='right' className='col-lg-6 mt-5'>
                <Box style={{ alignItems: 'flex-start' }}>
                  <Square>Create NFTs</Square>
                  <article className='text-left'>
                    <span>That should be an NFT</span>
                  </article>
                  <p className='mt-3 color-b text-left'>Our best-in-class tools easily transform your art into 1/1s, limited and open editions or generative collections in just a few steps.</p>
                </Box>
              </Fade>
            </div>

            <Divider />
            <div className='mt-5 row align-items-center'>
              <Fade direction='left' className='col-lg-6 mt-5'>
                <Box style={{ alignItems: 'flex-start' }}>
                  <Square>Generative collections</Square>
                  <article className='text-left'>
                    <span>Simplify and own your NFT launch</span>
                  </article>
                  <p className='mt-3 color-b text-left'>
                    Thousands of artists have built their NFT projects with Metaplex, one of the fastest-growing creator platforms in the world. From 1/1 art to generative drops, Creator Studio streamlines the process of building and selling digital assets.
                  </p>
                </Box>
              </Fade>

              <div className='col-lg-6 mt-5'>
                <Fade direction='right'>
                  <Card>
                    <div>Upload</div>
                    <p>Upload your art files and some basic metadata to Creator Studio.</p>
                  </Card>
                </Fade>

                <Fade direction='right' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Card>
                    <div>Mint</div>
                    <p>A streamlined creative process lets you easily mint digital assets, including generative collections, 1/1 art, or open and limited editions.</p>
                  </Card>
                </Fade>

                <Fade direction='right'>
                  <Card>
                    <div>Drop</div>
                    <p>Launch your collection with a customizable mint page for your community.</p>
                  </Card>
                </Fade>
              </div>
            </div>

            <Divider />
            <Fade direction='up' className='col-lg-12 mt-5'>
              <Box>
                <article>
                  <span>What will you create?</span>
                </article>
                <p className='mt-3 color-b' style={{ maxWidth: 570 }}>First timer, or frequent minter? We’re seeking creators of all kinds to launch with our no-code tools. Join the waitlist and be part of the first wave.</p>
                <div className='mt-5 btn btn-primary' onClick={() => handleRoute(router, '/makeNFTs')}>Go to Create</div>
              </Box>
            </Fade>

            <Divider />
            <div className='d-flex align-items-center justify-content-center'>
              @2024 Klik, Inc
            </div>
          </div>
        </div>

        <br />
      </LayoutPage>
    </div>
  );
}

export default Landing;
