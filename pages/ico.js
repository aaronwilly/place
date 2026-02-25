import React, { useEffect } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';

const HelpPage = () => {

  useEffect(() => {
    window.location.href = 'https://rhahn437.wixsite.com/mysite/programs';
  }, [])

  return (
    <LayoutPage>
      <LayoutScreen title=''>
        <div className="d-flex flex-row justify-content-center">
          
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default HelpPage;
