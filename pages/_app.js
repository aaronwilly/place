import NextNProgress from 'nextjs-progressbar';
import { useEffect } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import TimeAgo from 'javascript-time-ago';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import { Provider } from 'react-redux';
import store from '../store/store';
import Header from '../components/header';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
// import HeaderNotification from '../components/header/HeaderNotification';
import { Web3AuthProvider } from '../services/web3auth';
import { PROD } from '../keys';

import en from 'javascript-time-ago/locale/en.json';
import '../styles/globals.css';


import 'bootstrap/dist/css/bootstrap.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import 'react-tagsinput/react-tagsinput.css';
import 'react-phone-number-input/style.css';
import '@stream-io/stream-chat-css/dist/css/index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/elegant-icons/style.css';
import '../public/assets/animated.css';
import '../public/assets/style.scss';
import '../public/assets/custom.scss';
import '../components/chat/chat.css';
import '../components/livestream/livestream.scss';
import '../pages/chatGPT/chatGPT.css';
import '../pages/chatGPT/PromptInput/PromptInput.css';
import '../pages/chatGPT/PromptResponseList/PromptResponseList.css';
import '../styles/btn.css';

TimeAgo.addDefaultLocale(en);

export default function App({ Component, pageProps }) {

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, [])

  return (
    <HMSRoomProvider>
      <Provider store={store}>
        <Web3AuthProvider web3AuthNetwork={PROD ? 'cyan' : 'testnet'}>
            <SkeletonTheme baseColor='#202020' highlightColor='#444'>
              <NextNProgress height={5} color='#2080d0' />
              <div className='app-wrapper'>
                <h1 className='d-none'>Klik</h1>
                <Header />
                {/* <HeaderNotification /> */}
                <div className='d-flex flex-row'>
                  <SideBar />
                  <div className='w-100'>
                    <Component {...pageProps} />
                  </div>
                  {/* <RightBar /> */}
                </div>
                <Footer />
              </div>
            </SkeletonTheme>
        </Web3AuthProvider>
      </Provider>
    </HMSRoomProvider>
  )
}
