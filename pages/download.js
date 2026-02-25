import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import useWindowSize from '../hooks/useWindowSize';
import LayoutPage from '../components/layouts/layoutPage';
import { MetaTag } from '../components/MetaTag';
import { createTeamEmail } from '../common/api/noAuthApi';
import { IcLogo } from '../common/icons';
import UtilService from '../sip/utilService';
import { DESCRIPTION, TITLE, VERSION } from '../keys';

const ICON = styled.img`
  height: 80px;
  @media only screen and (max-width: 700px) {
    height: 40px;
  }
`

const Woman = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
`

const Logo = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
`

const Version = styled.div`
  font-size: 12px;
  color: #777;
  cursor: pointer;
  position: fixed;
  bottom: 10px;
  left: 10px;
`

const IMG = styled.img`
  width: 700px;
  height: 900px;
  /* margin-bottom: -30px; */
  @media only screen and (max-width: 700px) {
    width: 190px;
    height: 300px;
  }
`

const QR = styled.img`
  height: 180px;
  width: 180px;
  align-self: center;
  @media only screen and (max-width: 700px) {
    height: 140px;
    width: 140px;
  }
`

const Btn = styled.div`
  background: #55b78b;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 12px;
  border-radius: 2px;
  height: 50px;
  margin-left: 10px;
  width: 120px;
  cursor: pointer;
`

const Input = styled.input`
  background: #fff;
  padding: 0 12px;
  height: 52px;
  border-radius: 2px;
  width: 320px;
  @media only screen and (max-width: 700px) {
    width: 160px;
  }
`
const EmailBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
  margin-bottom: 110px;
  @media only screen and (max-width: 700px) {
    margin-top: 20px;
  }
`

const BorderText = styled.div`
  font-size: 80px;
  line-height: 80px;
  color: #fff;
  text-transform: uppercase;
  font-family: 'TiltWarp-Regular', sans-serif;
  text-shadow: 0 1px 0 #CCCCCC, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
  @media only screen and (max-width: 700px) {
    font-size: 40px;
    line-height: 40px;
  }
`

const DownloadPage = () => {

  const router = useRouter();
  const { width } = useWindowSize();
  const [email, setEmail] = useState();
  const isMobile = width < 600;

  const onSendEmail = async () => {
    if (!email) {
      toast('Please input your email');
      return false;
    }

    if (!UtilService.ValidateEmail(email)) {
      toast('You have entered an invalid e-mail address. Please try again.')
      return false;
    }

    const response = await createTeamEmail({ email });

    if (response) {
      toast(`${email} has been added in KLIK. We will be back soon.`);
    } else {
      toast('Email already exists');
    }
  }

  const onDownload = () => {
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      window.location.replace('https://apps.apple.com/ph/app/klik-social/id6471041690?platform=iphone')
    } else {
      window.location.replace('https://play.google.com/store/apps/details?id=com.klikmobile')
    }
  }

  return (
    <div>
      <MetaTag
        {...{
          title: TITLE,
          description: DESCRIPTION,
          image: 'https://ucarecdn.com/1bd723ba-565e-4e85-913b-4fc06751746f/Screenshot_1.png',
        }}
      />

      <LayoutPage backHidden>
        <Logo>
          <Link href='/' prefetch={false}>
            <picture>
              <img src={IcLogo.src} className='cursor-pointer' alt='logo' width={isMobile ? 0 : 100} />
            </picture>
          </Link>
        </Logo>

        <Version>{VERSION}</Version>

        <div className='w-100' style={{ background: '#fee440' }}>

          <div className='row d-flex flex-row align-items-center'>

            <EmailBox>
              {/* <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Email address'
              />
              <Btn onClick={onSendEmail}>Join</Btn> */}
            </EmailBox>

            <div className='col-md-2 col-xs-12 align-items-center p-5'>
            </div>


            <div className='col-md-5 col-xs-12 d-flex flex-column'>
              <div style={{ marginTop: -150 }}>
                <BorderText className='text-center'>Join Your Klik</BorderText>
                <BorderText className='text-center'>Now!</BorderText>
              </div>

              <div style={{ marginTop: 50, alignSelf: 'center' }}>
                <QR src='../../img/metasalt_qrcode.png' className='m-3' />
              </div>

              <div className='d-flex flex-row align-items-center justify-content-center'>

                <a target='_blank' rel="noreferrer" href='https://play.google.com/store/apps/details?id=com.klikmobile'>
                  <ICON src='../../img/other/playstore.png' className='m-3 cursor-pointer' />
                </a>
                <a target='_blank' rel="noreferrer" href='https://apps.apple.com/ph/app/klik-social/id6471041690?platform=iphone'>
                  <ICON src='../../img/other/appstore.png' className='m-3 cursor-pointer' />
                </a>

              </div>
              <div className='mt-5 btn bg-primary pt-3 pb-3' style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20 }} onClick={onDownload}>DOWNLOAD</div>

            </div>

            <Woman className='col-md-5 col-xs-12'>
              <IMG src='../../img/other/girl.png' />
            </Woman>
          </div>

          <ToastContainer autoClose={3000} theme='dark' />
        </div>
      </LayoutPage>
    </div>
  );
}

export default DownloadPage;
