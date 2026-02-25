import React from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { Help1Lottie, Help2Lottie, Help3Lottie } from '../components/loading';

const HelpPage = () => {
  return (
    <LayoutPage>
      <LayoutScreen title='Help'>
        <div className="d-flex flex-row justify-content-center">
          <Help1Lottie />
          <Help2Lottie />
          <Help3Lottie />
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default HelpPage;
