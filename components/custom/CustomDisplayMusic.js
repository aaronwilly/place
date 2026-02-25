import React from 'react';
import styled from 'styled-components';
import UtilService from '../../sip/utilService';

const Box = styled.div`
  width: 290px;
  background: #222;
  border-radius: 12px;
  margin: 5px;
  box-shadow: 2px 2px 20px 0 rgba(131, 100, 226, 0);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 190px;
    margin-top: 20px;
  }
`

const Category = styled.div`
  background: #eb0400;
  border-radius: 5px;
  margin-right: 3px;
  padding: 0 5px;
  position: absolute;
  right: -6px;
  top: -6px;
  font-size: 12px;
  color: #fff;
`

const IMG = styled.div`
  width: 290px;
  height: 170px;
  background-size: cover;
  background-position: center;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;

  @media only screen and (max-width: 600px) {
    width: 190px;
    height: 90px;
  }
`

const CustomDisplayMusic = ({ music, onGoClick }) => {
  return (
    <Box>
      <IMG
        className='cursor-pointer'
        style={{ backgroundImage: `url(${UtilService.ConvertImg(music?.thumbnail) || '/img/music.jpg'})` }}
        onClick={onGoClick}
      />

      <div className="f-1 align-items-center">
        <picture>
          <img
            src={'https://static.twitchcdn.net/assets/music-5fb4595a30d04d991e24.svg'}
            alt='icon'
            className="mobile-hidden"
            style={{ width: 70, padding: 5, margin: '0 7px' }}
          />
        </picture>

        <div className='p-2 d-flex flex-column'>
          <div className='color-yellow overflow-hidden' style={{ maxHeight: 24 }}>{music?.title}</div>
          <div className='color-b overflow-hidden' style={{ maxHeight: 22, fontSize: 12 }}>{music?.description}</div>
        </div>

        <Category>{music?.category}</Category>
      </div>
    </Box>
  )
}

export default CustomDisplayMusic;
