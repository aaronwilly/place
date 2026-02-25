import React, { useEffect } from 'react';
import LayoutPage from '../../components/layouts/layoutPage';

const CollectionDetail = ({ userAgent, collectionId }) => {

  const openApp = () => {
    window.location.href = `metasalt://collectionDetail/${collectionId}`;
  };

  const redirectToAppStore = () => {
    if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
      window.location.replace('https://onelink.to/gfnq8n');
    }
  };

  useEffect(() => {

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
    <LayoutPage></LayoutPage>
  )
};

CollectionDetail.getInitialProps = ({ req, query }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const { collectionId } = query;
  return { userAgent, collectionId };
};

export default CollectionDetail;
