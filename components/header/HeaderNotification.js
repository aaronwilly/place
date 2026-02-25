import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../../store/actions/notifications/notifications';
import { ArrowLottie } from '../loading';
import useWindowSize from '../../hooks/useWindowSize';
import UtilService from '../../sip/utilService';

const Content = styled.div`
  font-size: 18px;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`

const HeaderNotification = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { width } = useWindowSize()

  const pathname = router.pathname
  const { notification, type, additional } = useSelector(state => state.notifications)
  const isTop = UtilService.disableHeader(pathname)
  const isMobile = width < 600

  useEffect(() => {
    if (type === 'success') {
      setTimeout(() => onClose(), 5000)
    }
  }, [notification])

  const onClose = () => dispatch(removeNotification())

  if (!notification) {
    return null
  }

  return (
    <div
      className='notification'
      style={{ background: UtilService.getColorNotification(type), top: isTop ? 0 : isMobile ? 50 : 72 }}
    >
      <Content className='mt-1 d-flex flex-row align-items-center justify-content-center' style={{ color: type === 'info' ? '#333' : 'white' }}>
        {notification}
        {additional === 'metamask' &&
          <div>&nbsp; Install <a className='color-yellow' href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en' target='_blank' rel='noreferrer'> metamask </a>in your browser. </div>
        }
        <span aria-hidden='true' className='icon_close fs-28 cursor-pointer' onClick={onClose} />
      </Content>

      {notification === '🦊 Please connect your wallet to this website manually, and refresh the page!' &&
        <div>
          <div style={styles.box}>
            <ArrowLottie />
            <div className='d-flex align-items-center justify-content-center'>
              <picture>
                <img src={'img/gif/01.gif'} alt='' style={{ width: 300, marginTop: 12, borderRadius: 12 }}/>
              </picture>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default HeaderNotification;

const styles = {
  box: {
    width: 320,
    height: 530,
    background: '#333',
    borderRadius: 12,
    position: 'absolute',
    top: 70,
    right: 10,
    zIndex: 9999
  }
}
