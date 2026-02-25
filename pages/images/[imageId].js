import Image from 'next/image';
import React, { useEffect } from 'react';
import { getManagementToken } from '../../common/api/authApi';


const ImageDetailPage = ({ userAgent, imageId }) => {

  useEffect(() => {

    const openApp = () => {
      window.location.href = `metasalt://imageList/${imageId}`;
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

  useEffect(() => {
    return () => {
      // hmsActions.leave().then()
    }
  }, [])

  return (
    <>
      <div className='livestream-container'>

      </div>
    </>
  )
}

export const getServerSideProps = async ({ res, req, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const { imageId } = query
  const response1 = await getManagementToken()

  return {
    props: {
      userAgent,
      imageId,
      managementToken: response1 || null,
    }
  }
}

export default ImageDetailPage;
