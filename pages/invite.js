import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import CustomPopover from '../components/custom/CustomPopover';
import { useWeb3Auth } from '../services/web3auth';
import UtilService from '../sip/utilService';
import { DEMO_AVATAR, InviteUrl } from '../keys';

const Box = styled.div`
  max-width: 600px;
  background: #0f0f0f;
  border-radius: 12px;
  margin-top: 30px;
  padding: 20px;

  @media only screen and (max-width: 600px) {
    max-width: 220px;
    margin-left: -10px;
    padding: 10px;
  }
`

const Text = styled.div`
  font-size: 16px;

  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border: 1px solid grey;
  border-radius: 20px;
  margin: 0 12px 0 3px;
`

const User = styled.div`
  background: #222;
  border-radius: 12px;
  margin: 8px 3px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const InvitePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useWeb3Auth();
  const [referrals, setReferrals] = useState([]);

  const copyText = `${InviteUrl}?ref=${user?.account}`;

  return (
    <LayoutPage>
      <LayoutScreen title={'Invite Friends'}>
        <div className='mt-3 d-flex justify-content-center'>
          <Box className='color-b'>
            <p className='fs-22 fw-bold'>Invite Friends to Klik</p>
            <Text>Do you know people who could benefit from Klik? You’ll get credit for friends who join when we add paid accounts.</Text>
            <div>
              <div className='mt-3 fs-12'>Invite URL</div>
              <div className='mt-1 d-flex flex-row'>
                <input className='w-100 br-4 px-1 fs-13' style={{ color: '#bbb' }} value={copyText} disabled />
                <CustomPopover content='Copy Link'>
                  <CopyToClipboard text={copyText} onCopy={() => dispatch(addNotification('Invite URL copied to your clipboard'))}>
                    <div className='bg-primary br-4 ml-2 p-2 cursor-pointer'>
                      <picture><img src={'img/icons/ic_copy.png'} alt='' /></picture>
                    </div>
                  </CopyToClipboard>
                </CustomPopover>
              </div>
            </div>
          </Box>
        </div>

        <div className='d-flex justify-content-center'>
          <Box className='color-b'>
            <p className='fs-22 fw-bold'>People You’ve Invited</p>
            <Text>Bragging rights, baby. These are the folks you’ve personally invited to the platform.</Text>

            <div className='my-2 fs-13'>📩 For every person you invite who registers and becomes a Klik creator, you’ll earn a free month of Klik Pro (up to 3 months, Klik Pro coming later this year).</div>

            {referrals.length === 0 ?
              <div className='p-3 fs-12 color-b text-center' style={{ background: '#3f3f3f' }}>Invite friends to get started. When an account is created using your code, they’ll show up here.</div>
              :
              <div>
                You invited {referrals.length} users
                <div>
                  {referrals.map((item, index) =>
                    <User key={index} className={!item?.receiver?.account && 'btn-disabled'} onClick={() => router.push(`/sales/${item?.receiver?.account}`)}>
                      <Avatar src={UtilService.ConvertImg(item?.receiver?.avatar) || DEMO_AVATAR} alt='avatar' />
                      <div>{item?.receiver?.username}</div>
                    </User>
                  )}
                </div>
              </div>
            }
          </Box>
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default InvitePage;
