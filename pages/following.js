import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import LayoutPage from '../components/layouts/layoutPage';
import Communities from '../atoms/home/Communities';
import TopVideos from '../atoms/home/TopVideos';
import TopMusics from '../atoms/home/TopMusics';
import TopDiscourse from '../atoms/home/TopDiscourse';
import { useWeb3Auth } from '../services/web3auth';
import { GetFollowingPageData } from '../common/api/noAuthApi';
import { handleRoute } from '../common/function';
import { Title } from '../constants/globalCss';

const Box = styled.div`
  margin-left: 65px;

  h2 {
    color: #bbb;
    cursor: pointer;
    font-family: 'Ramabhadra', sans-serif;
    font-size: 40px;
  }

  p {
    margin-top: -8px;
    font-size: 20px;
  }

  @media only screen and (max-width: 600px) {
    margin: 0 3px 0 0;
    text-align: center;
    h2 {
      font-size: 22px;
      margin-bottom: 15px;
    }

    p {
      font-size: 14px;
      margin-top: -15px;
    }
  }
`

const FollowingPage = () => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [tab, setTab] = useState(0)
  const [followingData, setFollowingData] = useState([])

  const communities = useMemo(() => {
    const filtered = followingData.filter(item => item?.type === 'community')
    return filtered.map(item => item?.community)
  }, [followingData])
  const discourses = useMemo(() => {
    const filtered = followingData.filter(item => item?.type === 'discourse')
    return filtered.map(item => item?.discourse)
  }, [followingData])
  const musics = useMemo(() => {
    const filtered = followingData.filter(item => item?.type === 'music')
    return filtered.map(item => item?.music)
  }, [followingData])
  const videos = useMemo(() => {
    const filtered = followingData.filter(item => item?.type === 'video')
    return filtered.map(item => item?.video)
  }, [followingData])

  useEffect(() => {
    const loadData = async () => {
      const response = await GetFollowingPageData({ likerId: user?.account })
      response && setFollowingData(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  return (
    <LayoutPage>
      <div className='text-center p-5'>
        <Title>Following</Title>
      </div>

      <div className='m-5 color-b mt-4 mobile-hidden'>
        <div>
          <span className={`fs-24 cursor-pointer ${tab === 0 && 'color-sky fw-semibold'}`}
                onClick={() => setTab(0)}>Overview</span>&nbsp;&nbsp;
          <span className={`fs-24 cursor-pointer ${tab === 1 && 'color-sky fw-semibold'}`}
                onClick={() => setTab(1)}>Communities</span>&nbsp;&nbsp;
          {/* <span className={`f-24 cursor-pointer ${tab === 2 && 'color-sky fw-semibold'}`} onClick={() => setTab(2)}>Streams</span>&nbsp;&nbsp; */}
          <span className={`fs-24 cursor-pointer ${tab === 3 && 'color-sky fw-semibold'}`}
                onClick={() => setTab(3)}>Videos</span>&nbsp;&nbsp;
          <span className={`fs-24 cursor-pointer ${tab === 4 && 'color-sky fw-semibold'}`}
                onClick={() => setTab(4)}>Music</span>&nbsp;&nbsp;
          <span className={`fs-24 cursor-pointer ${tab === 5 && 'color-sky fw-semibold'}`}
                onClick={() => setTab(5)}>Discourse</span>&nbsp;&nbsp;
        </div>
      </div>

      {(tab === 0 || tab === 1) && <div className='mt-5'>
        <div className='row'>
          <div className='col-lg-12'>
            <Box>
              <h2 onClick={() => handleRoute(router, '/nftcommunities')}>Communities</h2>
            </Box>
          </div>
          <div className='col-lg-12'>
            <Communities communities={communities} />
          </div>
        </div>
      </div>}

      {(tab === 0 || tab === 3) &&
        <div className='mt-5 row'>
          <div className='col-lg-12'>
            <Box>
              <h2 onClick={() => handleRoute(router, '/videos')}>Videos</h2>
            </Box>
          </div>
          <div className='col-lg-12'>
            <TopVideos videos={videos} />
          </div>
        </div>
      }

      {(tab === 0 || tab === 4) &&
        <div className='mt-5 row'>
          <div className='col-lg-12'>
            <Box>
              <h2 onClick={() => handleRoute(router, '/music')}>Music</h2>
            </Box>
          </div>
          <div className='col-lg-12'>
            <TopMusics musics={musics} />
          </div>
        </div>
      }

      {(tab === 0 || tab === 5) &&
        <div className='mt-5 row'>
          <div className='col-lg-12'>
            <Box>
              <h2 onClick={() => handleRoute(router, '/discourse')}>Channels</h2>
            </Box>
          </div>
          <div className='col-lg-12'>
            <TopDiscourse discourses={discourses} />
          </div>
        </div>
      }
    </LayoutPage>
  );
}

export default FollowingPage;
