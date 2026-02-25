import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';
import { useSelector } from 'react-redux';
import LayoutPage from '../../components/layouts/layoutPage';
import ProfileFilterBar from '../../atoms/sales/ProfileFilterBar';
import ProfileLeftMenu from '../../atoms/sales/ProfileLeftMenu';
import ProfileNFTList from '../../atoms/sales/ProfileNFTList';
import { useWeb3Auth } from '../../services/web3auth';
import { getAllVerifications, getCollection, getOrderData } from '../../common/api/authApi';
import { GetAllNFTs } from '../../common/api/noAuthApi';
import { handleRoute } from '../../common/function';
import { UploadSVG } from '../../common/svg';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR, PROD, PROFILE_BG } from '../../keys';

const Box = styled.div`
  min-width: auto;
  background: ${props => props.follow ? '#fff' : '#222528'};
  border-radius: 16px;
  margin: 0 7px;
  padding: 8px 18px;
  font-size: 14px;
  color:  ${props => props.follow ? '#333' : '#bbb'};
  cursor: pointer;
  transform-origin: center center;
  display: flex;
  flex-flow: row nowrap;
`

const ShareOverlay = styled.div`
  width: 350px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  margin-top: 10px;
  margin-left: -60px;
  padding: 12px;
  color: #bbb;
  box-shadow: rgba(0, 0, 0, 0.19) 0 1px 2px, rgba(0, 0, 0, 0.23) 0 4px 3px;
  position: absolute;
  z-index: 100;
`

const Pane = styled.div`
  width: 300px;
  border: 1px solid #333;
  border-radius: 20px;
  margin-top: 3px;
  padding: 20px;
  position: absolute;
  right: 30px;
`

const IndividualCollectionPage = ({ userAgent, collectionId, collection, allOrderData, allVerifications }) => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [realData, setRealData] = useState([])
  const [isShare, setIsShare] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { filter } = useSelector(state => state.nfts)
  const { visible } = filter
  const shareLink = PROD ? 'https://klik.cool' : 'https://dev.saltapp.io';

  const loadNFTsByCollection = async () => {
    setRealData([])
    setIsLoading(true)
    const response = await GetAllNFTs()
    if (response) {
      setRealData(response.filter(item => item?.collectionId === collectionId))
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNFTsByCollection().then()
  }, [collectionId])

  useEffect(() => {

    const openApp = () => {
      window.location.href = `metasalt://collection-detail/${collectionId}`;
    };

    const redirectToAppStore = () => {

      if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
        window.location.replace('https://onelink.to/gfnq8n');
      }
    };

    const checkAppAndRedirect = () => {

      if (userAgent.match(/iPhone|iPad|iPod/i)) {
        if (window.navigator.standalone === false) {
          setTimeout(() => redirectToAppStore(), 100);
        }

        const start = Date.now();
        const timeout = 1000;

        openApp();

        setTimeout(() => {
          const elapsed = Date.now() - start;
          if (elapsed < timeout + 20) redirectToAppStore();
        }, timeout);
      }

      if (userAgent.match(/Android/i)) {

        openApp();

        setTimeout(() => {
          if (document.hidden === false) redirectToAppStore();
        }, 2000);
      }
    };

    checkAppAndRedirect();
  }, []);

  return (
    <LayoutPage backHidden>

    <div className='position-relative'>
      <div
        className='breadcumb no-bg'
        style={{ backgroundImage: `url(${UtilService.ConvertImg(collection?.banner) || PROFILE_BG})`, backgroundPosition: 'center', padding: 30 }}
      >
        <div className='mainbreadcumb' />
      </div>

      <Pane>
        <div className='d-row justify-content-between'>
          <div>Floor</div>
          <div>1</div>
        </div>
        <div className='d-row justify-content-between mt-2'>
          <div>Items</div>
          <div>1</div>
        </div>
        <div className='d-row justify-content-between mt-2'>
          <div>Owners</div>
          <div>1</div>
        </div>

      </Pane>

    </div>

    <div className='d-flex flex-column p-5'>

      <div className='profile-avatar'>
        <picture><img src={UtilService.ConvertImg(collection?.avatar) || DEMO_AVATAR} alt='avatar' /></picture>
        <br />
      </div>

      <h2 className='color-b'>{collection?.title}</h2>
      <div className='color-7'>{collection?.description}</div>
      {collection?.creatorId === user?.account &&
        <div className='width-150 mt-3 btn btn-primary' onClick={() => handleRoute( router, `/edit/collection/${collectionId}`)}>Edit</div>
      }
    </div>

    <div className='d-flex flex-row' style={{ marginLeft: 25 }}>
      <div>
        <Box onClick={() => setIsShare(true)}>
          <UploadSVG />
        </Box>
        {isShare &&
          <OutsideClickHandler onOutsideClick={() => setIsShare(false)}>
            <ShareOverlay>
              <div className='mb-3 fs-24 text-center'>Share link to this page</div>
              <div className='fs-12 d-flex flex-row justify-content-between'>
                <div><WhatsappShareButton url={shareLink}><WhatsappIcon size={25} round /> Whatsapp</WhatsappShareButton></div>
                <div><TwitterShareButton url={shareLink}><TwitterIcon size={25} round /> Twitter</TwitterShareButton></div>
                <div><FacebookShareButton url={shareLink}><FacebookIcon size={25} round /> Facebook</FacebookShareButton></div>
                <div><LinkedinShareButton url={shareLink}><LinkedinIcon size={25} round /> Linkedin</LinkedinShareButton></div>
                <div><EmailShareButton url={shareLink}><EmailIcon size={25} round /> Email</EmailShareButton></div>
              </div>
            </ShareOverlay>
          </OutsideClickHandler>
        }
      </div>

    </div>

    <ProfileFilterBar onRefresh={loadNFTsByCollection} />
    <div className='d-flex flex-row'>
      {visible && <ProfileLeftMenu {...{ show: false }} />}
      <ProfileNFTList {...{ isLoading, realData, allOrderData, allVerifications }} />
    </div>
  </LayoutPage>
  );
}

export const getServerSideProps = async ({ res, req, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

  const { collectionId } = query

  const response1 = await getCollection({ _id: collectionId })
  const response2 = await getOrderData({})
  // const response3 = await getAllVerifications()

  return {
    props: {
      userAgent,
      collectionId,
      collection: response1 || null,
      allOrderData: response2 || [],
      // allVerifications: response3 || [],
    }
  }
}

export default IndividualCollectionPage;
