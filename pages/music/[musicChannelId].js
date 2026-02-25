import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import LayoutPage from '../../components/layouts/layoutPage';
import CustomDisplayMusic from '../../components/custom/CustomDisplayMusic';
import { useWeb3Auth } from '../../services/web3auth';
import { GetMusicChannel, GetMusics } from '../../common/api/noAuthApi';
import { handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';

const Absolute = styled.div`
  margin-top: -100px;
  margin-left: 30px;
  position: absolute;
`

const IMG = styled.img`
  width: 120px;
  height: 120px;
  border: 5px solid #fff;
  border-radius: 12px;
`

const MusicDetail = ({ musicChannel, musics }) => {

  const router = useRouter()
  const { user } = useWeb3Auth()

  return (
    <LayoutPage>
      {musicChannel &&
        <>
          <div
            className='jumbotron breadcumb no-bg'
            style={{ background: `url(${musicChannel?.banner || DEMO_BACKGROUND})` || '#141414', backgroundSize: 'cover' }}
          >
            <div className='mainbreadcumb' />

            <Absolute>
              <IMG src={UtilService.ConvertImg(musicChannel?.avatar) || DEMO_AVATAR} alt='avatar' />

              <div>
                <h2 className='mt-3 color-b'>{musicChannel?.title}</h2>
                <div className='color-b' style={{ marginTop: -10 }}>{musicChannel?.description}</div>
                {user?.account === musicChannel?.creatorId &&
                  <div className='mt-3 btn btn-primary' onClick={() => handleRoute(router, `/edit/musicChannel/${musicChannel?._id}`)}>Edit</div>
                }
              </div>
            </Absolute>
          </div>
          <br />
          <section>
            <h3 className='mt-90 color-b text-center'>Trending music communities in {musicChannel?.title}</h3>
            <div className='mt-5 d-flex flex-wrap align-items-center justify-content-center'>
              {musics.map((item, index) => (
                <CustomDisplayMusic key={index} music={item} onGoClick={() => handleRoute(router, `/musics/${item?._id}`)} />
              ))}
            </div>
          </section>
        </>
      }
    </LayoutPage>
  )
};

export const getServerSideProps = async ({ res, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const { musicChannelId } = query

  const response1 = await GetMusicChannel({ _id: musicChannelId })
  const response2 = await GetMusics({ musicChannelId })

  return {
    props: {
      musicChannel: response1 || null,
      musics: response2 || [],
    }
  }
}

export default MusicDetail;
