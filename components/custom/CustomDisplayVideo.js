import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import ReactTimeAgo from 'react-time-ago';
import { useWeb3Auth } from '../../services/web3auth';
import { handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';

const Duration = styled.div`
  background:rgb(23, 33, 53);
  border-radius: 8px;
  padding: 3px 4px;
  font-size: 11px;
  color: #aaa;
  position: absolute;
  bottom: 2px;
  right: 4px;
`

const Background = styled.div`
  width: 220px;
  height: 350px;

  @media only screen and (max-width: 600px) {
    width: 110px;
    height: 190px;
  }
`

const IMG = styled.img`
  width: 220px;
  height: 350px;
  border: 1px solid #bbb;
  opacity: 0.7;

  @media only screen and (max-width: 600px) {
    width: 110px;
    height: 190px;
  }
`

const CustomDisplayVideo = ({ video, hidden, visibleOnly }) => {

  const router = useRouter()
  const { user } = useWeb3Auth()

  return (
    <StyledWrapper>
      <div className="card" style={{ width: 230, height: 340, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundImage: `url(${UtilService.ConvertImg(video?.uploadcare_thumbnail)})` || DEMO_BACKGROUND }}>

        <center>
          <div className="profileimage">
            <picture>
              <img
                src={UtilService.ConvertImg(video?.creator?.avatar) || DEMO_AVATAR}
                alt="avatar"
                className='width-50 height-50 br-50'
                style={{ border: '2px solid #fff' }}
              />
            </picture>
          </div>

          {/*  */}

          <div className="Name">
            <p><ReactTimeAgo date={video?.createdAt} locale="en-US" /></p>
          </div>

          <div className="socialbar" onClick={() => handleRoute(router, `/videos/${video?._id}`)}>
            {video?.description || 'No title'}
          </div>

          {!visibleOnly && <Duration>{UtilService.GetTimeLabel(video?.duration || 5)}</Duration>}
        </center>
      </div>
    </StyledWrapper>
    // <div className='m-2 position-relative'>
    //   <Background>
    //     <IMG src={UtilService.ConvertImg(video?.thumbnail) || DEMO_BACKGROUND} alt='thumbnail' />
    //   </Background>
    //   <picture>
    //     <img
    //       src="/img/icons/play.png"
    //       alt="video"
    //       className="mobile-hidden position-absolute cursor-pointer"
    //       style={{ width: 60, top: 130, left: 80 }}
    //       onClick={() => handleRoute(router, `/videos/${video?._id}`)}
    //     />
    //   </picture>

    //   {video?.creator?._id === user?._id && !hidden && !visibleOnly &&
    //     <picture>
    //       <img
    //         src={IcPencil.src}
    //         alt="video"
    //         className="position-absolute cursor-pointer"
    //         style={{ top: -5, right: -5, backgroundColor: '#0075ff', borderRadius: 10, padding: 5, width: 30 }}
    //         onClick={() => handleRoute(router, `/edit/video/${video?._id}`)}
    //       />
    //     </picture>
    //   }

    //   {!visibleOnly && <Duration>{UtilService.GetTimeLabel(video?.duration || 5)}</Duration>}

    //   {!visibleOnly &&
    //     <div className='p-2 mobile-hidden d-flex flex-row'>
    //       <div className="mr-2 cursor-pointer d-flex align-items-center justify-content-center"
    //         onClick={() => handleRoute(router, `/sales/${video?.creator?.account}`)}>
    //         <picture>
    //           <img
    //             src={UtilService.ConvertImg(video?.creator?.avatar) || DEMO_AVATAR}
    //             alt="avatar"
    //             className='width-50 height-50 br-50'
    //             style={{ border: '1px solid #777' }}
    //           />
    //         </picture>
    //       </div>
    //       <div>
    //         <div className='fs-16 fw-semibold text-white' style={{ maxWidth: 150, overflow: 'hidden', height: 25 }}>
    //           {video?.description || 'No title'}
    //         </div>
    //         <div className="fs-11 color-yellow">{iconObject?.label}</div>
    //         <div className="fs-12 color-7">
    //           <ReactTimeAgo date={video?.createdAt} locale="en-US" />
    //         </div>
    //       </div>
    //     </div>
    //   }
    // </div>

  )
}

const StyledWrapper = styled.div`
  .card {
    width: 230px;
    height: 340px;
    margin: 10px;
    border-radius: 2em;
    padding: 10px;
    background-color: #191919;
    box-shadow: 5px 5px 30px rgb(4, 4, 4),
                     -5px -5px 30px rgb(57, 57, 57);
  }

  .profileimage {
    background-color: transparent;
    border: none;
    margin-top: 20px;
    border-radius: 5em;
    width: 100px;
    height: 100px;
  }

  .pfp {
    border-radius: 35em;
    fill: white;
  }

  .Name {
    color: white;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    padding: 10px;
    font-size: 16px;
    margin-top: 10px;
    opacity: 0.6
  }

  .socialbar {
    background-color: #191919;
    border-radius: 3em;
    width: 90%;
    padding: 12px;
    margin-top: 30px;
    height: 60px;
    color: #999;
    font-size: 15px;
    overflow: hidden;
    box-shadow: 3px 3px 15px rgb(0, 0, 0),
                     -3px -3px 15px rgb(58, 58, 58);
  }

  .socialbar:hover {
    background-color: #B975EF;
    color: #fff;
    cursor: pointer;
    transition: 1.4s;
  }

  .card a {
    transition: 0.4s;
    color: white
  }

  #github:hover {
    color: #c9510c;
  }

  #instagram:hover {
    color: #d62976;
  }

  #facebook:hover {
    color: #3b5998;
  }

  #twitter:hover {
    color: #00acee;
  }`;


export default CustomDisplayVideo;
