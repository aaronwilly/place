import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import LayoutPage from '../components/layouts/layoutPage';
import ModalTerms from '../components/modals/modalTerms';
import useWindowSize from '../hooks/useWindowSize';
import { useWeb3Auth } from '../services/web3auth';
import { createReferral, loginToBackend } from '../common/api/noAuthApi';
import { handleRoute } from '../common/function';

const LoginPage = ({ userAgent }) => {
  const router = useRouter();
  const { provider, login } = useWeb3Auth();
  const { width } = useWindowSize();

  const [isModal, setIsModal] = useState(false);

  const { ref } = router.query;
  const isMobile = width < 600;

  const handleLogin = async () => {
    provider ? handleRoute(router, '/') : login().then(async loginUser => {
      const response = await loginToBackend(loginUser);
      if (ref && response?.data?.firstLogin) {
        await createReferral({ ref, account: response?.data?.account });
      }
      handleRoute(router, '/');
    })
  }

  useEffect(() => {
    if (userAgent.match(/Android/i)) {
      window.location.replace('https://onelink.to/gfnq8n');
    }
    if (userAgent.match(/iPhone|iPad|iPod/i)) {
      window.location.replace('https://onelink.to/gfnq8n');
    }
  }, [userAgent]);

  return (
    <LayoutPage>
      <div className='row mx-0 align-items-center' style={{ height: '100vh' }}>
        <div className='col-md-6 my-5'>
          <div className='row'>
            <div className='col-lg-6 m-auto'>
              <h3 className='mb-2 fs-40 fw-bold color-purple-blue cursor-pointer' onClick={() => handleRoute(router, '/')}>Klik</h3>
              <h2 className='my-4 fw-bold text-white cursor-pointer' onClick={handleLogin}>Log in</h2>
              <br/>
              <div className='w-100 mb-3 btn btn-submit' onClick={handleLogin}>Log In</div>
            </div>
          </div>
        </div>
        {!isMobile && <div className='col-md-6 login-img' />}
      </div>

      {isModal && <ModalTerms
        email={true}
        onClose={() => setIsModal(false)}
        onGo={() => {
          setIsModal(false)
          handleRoute(router, '/mynfts')
        }}
      />}
    </LayoutPage>
  )
}

LoginPage.getInitialProps = ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

export default LoginPage;
