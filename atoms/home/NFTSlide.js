import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import { GetAllLazyMints } from '../../common/api/noAuthApi';
import UtilService from '../../sip/utilService';

const Box = styled.div`
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
`

const Container = styled.div`
  padding: 0 40px;
`

const Background = styled.div`
  width: 100%;
  height: 350px;
  background: #444 no-repeat center;
  background-size: cover;
  border-radius: 12px;
  box-shadow: 0 0 5px 0px, inset 0 0 9px 0px;
  animation: rot 2s infinite ease;
  transform-style: preserve-3d;
  transition: 1s;

  @media only screen and (max-width: 1300px) {
    height: 250px;
  }
  @media only screen and (max-width: 900px) {
    height: 200px;
  }
  @media only screen and (max-width: 600px) {
    height: 250px;
  }
`

const NFTSlide = () => {

  const router = useRouter()
  const [NFTs, setNFTs] = useState([])

  const settings = {
    dots: true,
    infinite: NFTs.length > 3,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const loadNFTs = async () => {
      const response = await GetAllLazyMints()
      response && setNFTs(response)
    }

    loadNFTs().then()
  }, [])

  return (
    <div>
      <Container>
        <Slider {...settings}>
          {NFTs.slice(0, 12).map((item, index) => {
            const {
              image,
              thumbnail = 'https://minedn.io/ipfs/QmRamfc2stckiMtXonnBVHEgovy9qH8J1EiiNXRT6EBnVK'
            } = JSON.parse(item.metadata)
            return (
              <Box
                key={index}
                onClick={() => router.push(`/nftmarketplace/${UtilService.checkNet(item.token_address)}/${item.token_address}/${UtilService.tokenIDHexConvert(item.token_id)}`)}
              >
                <Background style={{ backgroundImage: `url(${UtilService.ConvertImg(item?.thumbnail || thumbnail || image)})` }} />
              </Box>
              
            )
          })}
        </Slider>
      </Container>
    </div>
  );
}

const StyledWrapper = styled.div`
  .one-div {
    position: relative;
    height: 250px;
    width: 200px;
    background-color: rgb(15, 15, 15);
    transform-style: preserve-3d;
    animation: rot 2s infinite ease;
    border-radius: 20px;
    box-shadow: 0 0 50px 0px, inset 0 0 90px 0px;
    color: white;
    transition: 1s;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .one-div .text {
    opacity: 0;
    transition: all 0.5s;
  }

  .one-div:hover.one-div .text {
    scale: 1.2;
    opacity: 0.7;
  }

  .one-div:hover {
    box-shadow: 0 0 50px 0px, inset 5px 5px 20px 0px black;
  }

  @keyframes rot {
    0% {
      transform: rotateX(-15deg) translateY(0px);
    }

    50% {
      transform: rotateX(-15deg) translateY(-10px);
    }

    100% {
      transform: rotateX(-15deg) translateY(0px);
    }
  }`;


export default NFTSlide;
