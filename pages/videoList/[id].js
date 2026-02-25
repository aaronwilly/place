import { useEffect } from 'react';

const VideoList = ({ userAgent, id }) => {

  useEffect(() => {

    const openApp = () => {
      window.location.href = `metasalt://videoList/${id}`;
    };

    const redirectToAppStore = () => {
      if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
        window.location.replace('https://onelink.to/gfnq8n');
      }
    };

    const checkAppAndRedirect = () => {
      if (userAgent.match(/iPhone|iPad|iPod/i)) {
        if (window.navigator.standalone === false) {
          setTimeout(() => {
            redirectToAppStore();
          }, 100);
        }

        const start = Date.now();
        const timeout = 1000;

        openApp();

        setTimeout(() => {
          const elapsed = Date.now() - start;
          if (elapsed < timeout + 20) {
            redirectToAppStore();
          }
        }, timeout);
      }

      if (userAgent.match(/Android/i)) {
        openApp();

        setTimeout(() => {
          if (document.hidden === false) {
            redirectToAppStore();
          }
        }, 2000);
      }
    };

    checkAppAndRedirect();
  }, []);

  return (
    <div style={{ height: 500 }}></div>
  )
}

VideoList.getInitialProps = ({ req, query }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const { id } = query;
  return { userAgent, id };
};

export default VideoList;
