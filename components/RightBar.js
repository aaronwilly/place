import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import useWindowSize from '../hooks/useWindowSize';
import { GetAllLikes } from '../common/api/noAuthApi';
import { useWeb3Auth } from '../services/web3auth';
import UtilService from '../sip/utilService';
import { PROD, VERSION, DEMO_AVATAR } from '../keys';

const Container = styled.div`
  width: ${props => props.disabled ? 0 : (props.opened ? 250 : 70)}px;
  height: 100vh;
  max-height: calc(100% - 75px);
  background: #222528;
  margin-top: 75px;
  overflow: auto;
  transition: all 0.3s ease-in-out;
  box-shadow: -2px 0 4px 0 rgba(0, 0, 0, 0.75);
  position: fixed;
  right: 0;
  z-index: 2;

  @media only screen and (max-width: 600px) {
    max-height: calc(100% - 40px);
    margin-top: 40px;
  }
`;

const Title = styled.div`
  background: ${props => props.selected ? '#8264e2' : '#1c1c26'};
  border-radius: 5px;
  margin-left: 3px;
  margin-right: 3px;
  padding: 2px 7px;
  font-family: 'Poppins', sans-serif;
  font-size: ${props => props.opened ? 14 : 10}px;
  font-weight: 400;
  color: ${props => props.selected ? '#fff' : '#bbb'};
  cursor: pointer;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  background: #111;
  border-radius: 8px;
  padding: 2px;
  position: absolute;
  right: 0;
  bottom: 0;
`

const Bottom = styled.div`
  height: 60px;
  font-size: ${props => props.opened ? 18 : 12}px;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Border = styled.div`
  width: 80%;
  height: 2px;
  background: brown;
  margin: 2px 0;
`

const UsersIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 20px;
  margin-top: 55px;
  color: #fff;
  transition: all 0.3s ease-in-out;
  box-shadow: -2px 3px 4px 0 rgba(0, 0, 0, 0.75);
  position: fixed;
  bottom: 6px;
  right: 5px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RightBar = () => {

  const router = useRouter()
  const { width } = useWindowSize()
  const { user, isAuthenticated, allUsers } = useWeb3Auth()
  const [initialHover, setInitialHover] = useState(false)
  const [tab, setTab] = useState(0)
  const [searchKey, setSearchKey] = useState('')
  const [userLikes, setUserLikes] = useState([])

  const notMeUsers = useMemo(() => allUsers.filter(item => item?.account !== user?.account), [allUsers, user])
  const pathname = router.pathname
  const isMobile = width < 600
  const uiOpened = isMobile ? true : initialHover
  const isDisable = UtilService.disableHeader(pathname)

  useEffect(() => {
    const loadData = async () => {
      const response = await GetAllLikes({ type: 'user', follow: true })
      response && setUserLikes(response)
    }

    loadData().then()
  }, [])

  const getFollowing = (userAccount) => {
    return userLikes.find(item => item?.likerId === user?.account && item?.userId === userAccount)
  }

  const getFollowed = (userAccount) => {
    return userLikes.find(item => item?.userId === user?.account && item?.likerId === userAccount)
  }

  if (isDisable) {
    return false
  }

  return (
    <div className='position-relative' style={{ zIndex: 99 }}>
      <UsersIcon onClick={() => setInitialHover(true)}>
        <span className='social_myspace' />
      </UsersIcon>

      <Container
        opened={uiOpened}
        disabled={isMobile && !initialHover}
        onMouseOver={() => setInitialHover(true)}
        onMouseLeave={() => setInitialHover(false)}
      >
        <div>
          <div className='mt-3 d-flex flex-row align-items-center justify-content-between'>
            <Title opened={uiOpened} selected={tab === 0} onClick={() => setTab(0)}>Online</Title>
            {isAuthenticated && <Title opened={uiOpened} selected={tab === 1} onClick={() => setTab(1)}>Following</Title>}
            {isAuthenticated && <Title opened={uiOpened} selected={tab === 2} onClick={() => setTab(2)}>Followers</Title>}
            {isMobile && <span className='icon_close mr-2 fs-20 color-white' onClick={() => setInitialHover(false)} />}
          </div>

          <div className='mt-2 mx-2'>
            <input
              className="form-control mb-1"
              placeholder="Search Username"
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
            />
          </div>

          <div className='d-flex align-items-center justify-content-center'>
            <Border />
          </div>

          <div className='hidden-scrollbar overflow-auto' style={{ height: 'calc(100vh - 250px)', flex: 1 }}>
            {tab === 0 && notMeUsers.length > 0 && notMeUsers.filter(item => item.username.includes(searchKey) || !searchKey)
              .map((item, index) => <ContactAtom key={index} item={item} opened={uiOpened} />)?.slice(0, 50)
            }
            {tab === 1 && notMeUsers.length > 0 && notMeUsers.filter(item => (item.username.includes(searchKey) || !searchKey) && getFollowing(item?.account))
              .map((item, index) => <ContactAtom key={index} item={item} opened={uiOpened} />)
            }
            {tab === 2 && notMeUsers.length > 0 && notMeUsers.filter(item => (item.username.includes(searchKey) || !searchKey) && getFollowed(item?.account))
              .map((item, index) => <ContactAtom key={index} item={item} opened={uiOpened} />)
            }
          </div>

          <div className='d-flex align-items-center justify-content-center'>
            <Border />
          </div>

          <Bottom opened={uiOpened}>
            {VERSION} {!PROD && 'Test'}
          </Bottom>
        </div>
      </Container>
    </div>
  )
};

export default RightBar;

const ContactAtom = ({ item, opened }) => {

  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const { lastOnline } = item
  const isDifferenceDay = lastOnline ? moment(new Date()).diff(moment(lastOnline), 'days') : 100

  return (
    <Link href={`/sales/${item?.account}`} prefetch={false}>
      <div className="mt-10 cursor-pointer position-relative d-flex flex-row align-items-center">
        <div className='width-40 height-40 my-0 mx-3 position-relative'>
          {imageLoadFailed ?
            <img src={DEMO_AVATAR} alt='{}' className='width-40 height-40 br-50' />
          :
            <img src={UtilService.ConvertImg2(item?.avatar)} alt='{}' className='width-40 height-40 br-50' f={() => setImageLoadFailed(true)} />
          }
          <Icon src={isDifferenceDay > 7 ? '/img/icons/ic_offline.png' : isDifferenceDay > 1 ? '/img/icons/ic_moon.png' : '/img/icons/ic_online.png'} />
        </div>
        <div className={opened ? 'd-block' : 'd-none'} style={{ maxWidth: 180 }}>
          <div className='fs-13 fw-bold color-b text-ellipsis'>{item?.username}</div>
        </div>
      </div>
    </Link>
  )
}
