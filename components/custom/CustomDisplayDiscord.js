import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';

const GreenBall = styled.div`
  width: 8px;
  height: 8px;
  background-color: #3ba55d;
  border-radius: 4px;
  margin-right: 5px;
`

const Title = styled.div`
  height: 40px;
  font-size: 19px;

  @media only screen and (max-width: 600px) {
    height: 30px;
    font-size: 15px;
  }
`

const Description = styled.div`
  font-size: 13px;

  @media only screen and (max-width: 600px) {
    font-size: 11px
  }
`

const Box = styled.div`
  width: 343px;
  height: 320px;
  background: #121212;
  border-radius: 6px;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    width: 300px;
    height: 220px;
  }
`

const IMG = styled.img`
  height: 160px;

  @media only screen and (max-width: 600px) {
    height: 90px;
  }
`

const CustomDisplayDiscord = ({ item }) => {

  const router = useRouter()

  const onGoLink = async () => {
    handleRoute(router, `/discourse/${item._id}`)
  }

  return (
    <Box className='m-3 position-relative d-flex flex-column align-items-center justify-content-center'>
      <IMG
        onClick={onGoLink}
        src={UtilService.ConvertImg(item?.thumbnail)}
        alt='thumb'
        className='cursor-pointer'
      />

      <div className="p-2 f-1 overflow-hidden d-flex flex-column" style={{ height: 160 }}>
        <Title className='text-white d-flex align-items-center justify-content-center'>✅{item?.title}</Title>
        <Description className='m-2 color-b d-flex align-items-center justify-content-center'>{item?.description}</Description>
      </div>

      <div className="w-100 fs-12 color-b d-flex flex-row justify-content-around mobile-hidden" style={{ height: 30 }}>
        <div className="d-flex flex-row align-items-center"><GreenBall />2 Online</div>
        <div className="d-flex flex-row align-items-center"><GreenBall style={{ background: '#aaa' }} />999 Members</div>
      </div>
    </Box>
  )
}

export default CustomDisplayDiscord;
