import { useRouter } from 'next/router';
import React from 'react';
import { handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';

const CustomThumbnailSmallVideo = ({ video, checkable, onChange, contentLink, editable }) => {

  const router = useRouter()

  return (
    <div
      className='m-2 d-center cursor-pointer position-relative'
      onClick={() => checkable ? onChange(video?.videoId) : handleRoute(router, `/videos/${video?._id}`)}
      style={{
        border: `3px solid ${contentLink === video?.videoId ? '#0075ff' : '#777'}`,
        borderRadius: 5,
        height: checkable ? 65 : 220,
        width: checkable ? 110 : 380,
        background: '#333',
        overflow: 'hidden'
      }}
    >
      {/* {video?.creator &&
        <picture style={{ position: 'absolute', right: 4, bottom: 4 }}>
          <img
            src={UtilService.ConvertImg(video?.creator?.avatar)}
            alt="user"
            className='width-50 height-50 br-50'
            style={{ border: '2px solid #bbb' }}
          />
        </picture>
      } */}

      <picture>
        <img src={UtilService.ConvertImg(video?.thumbnail)} style={{ width: checkable ? 105 : 370, height: checkable ? 60 : 250 }} alt='thumbnail' />
      </picture>

      {editable &&
        <div className="d-center" style={{ width: 36, height: 36, borderRadius: 18, background: '#333', position: 'absolute', right: 10, top: 5 }}>
          <span aria-hidden="true" className="icon_menu" />
        </div>
      }
    </div>
  )
}

export default CustomThumbnailSmallVideo;
