import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import CustomPopover from '../custom/CustomPopover';
import useWindowSize from '../../hooks/useWindowSize';
import { handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR } from '../../keys';

const Avatar = styled.img`
  position: absolute; 
  left: 12px;
  top: 12px;
  width: 40px; 
  height: 40px; 
  border-radius: 20px; 
  margin-right: 7px;

  @media only screen and (max-width: 600px){
    width: 30px;
    height: 30px;
    left: 3px;
    top: 3px;
  }
`

const CardCommunity = ({ community, home }) => {

  const router = useRouter()
  const { width } = useWindowSize()

  const typeContents = JSON.parse(community?.contents).map(item => item?.type?.label)
  const fullWidth = width > 1200 ? (width - 420) / 5 : 300
  const homeWidth = width > 1200 ? (width - 420) / 4 : 380
  const atomGatedWidth = home ? homeWidth : fullWidth

  return (
    <div
      className='bg-2 br-4 align-items-center'
      style={{ width: width > 600 ? atomGatedWidth : width / 4, margin: 5, boxShadow: 'rgb(0 0 0 / 10%) 0px 10px 15px -3px, rgb(0 0 0 / 10%) 0px 10px 15px -3px' }}
    >
      <div
        className='w-100 cursor-pointer position-relative'
        style={{ width: 200, height: width > 600 ? 200 : 100, backgroundImage: `url(${UtilService.ConvertImg(community?.img)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        onClick={() => handleRoute(router, `/nftcommunities/${community?._id}`)}
      >
        {width > 600 &&
          <div className='position-absolute' style={{ right: 3, top: 3 }}>
            {typeContents.map((item, index) =>
              <div key={index} className='width-50 height-40 bg-1 br-8' style={{ border: '2px solid #bbb', margin: 4 }}>
                <CustomPopover content={(item === 'Discord' ? 'Discourse' : item) + ' hidden'} >
                  {UtilService.getContentLottie(item)}
                </CustomPopover>
              </div>
            )}
          </div>
        }

        <Avatar src={UtilService.ConvertImg(community?.creator?.avatar) || DEMO_AVATAR} alt='' />
      </div>

      {width > 600 &&
        <div className='m-3 color-b overflow-hidden position-relative'>
          <div className='text-center'>
            <div className="garage-title fs-18 fw-semibold">{community?.title}</div>
            <br />
            {community?.description &&
              <div className="garage-title fs-13 fw-semibold" style={{ color: '#777', maxHeight: 22 }}>
                {(community?.description)}
              </div>
            }
          </div>

          <div className='mt-1 garage-title'>
            <span className='color-yellow'>Brand: </span> {community?.brand?.title}
          </div>
          <br />

          <div className="garage-title">
            <span className='color-green'>Collection: </span> {community?.Collection?.title}
          </div>
          <br />

          <div className="garage-title fs-13 fw-light fst-italic" style={{ color: '#777' }}>
            {community?.type + ' • ' + community?.status}
          </div>
        </div>
      }
    </div>
  )
}

export default CardCommunity;
