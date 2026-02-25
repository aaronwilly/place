import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from '@emotion/react';
import Lottie from 'lottie-react';
import nft1 from '../../constants/lottie/nft2.json';

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const Governance = () => {

  return (
    <div className="container">
      <div className="row align-items-center">

        <div className="col-md-6 xs-hide d-flex justify-content-center">
          {/* <img src="" style={{ maxWidth: 400 }} alt="" /> */}
          <Lottie animationData={nft1} loop style={{ maxWidth: 400 }}/>
        </div>

        <div className="col-md-6">
        <br/><br/>
          <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
            <h2 className='color-7'><span className='color-yellow'>$KLIK</span> Is Due Diligence</h2>
          </Reveal>

          <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={600} triggerOnce>
            <p className=" lead">
            Before you buy NFTs, check if they're real.
            $KLIK is a utility token that lets anyone check authenticity.
            Just enter the Token ID, click on the authenticate button, and the hidden codes will be revealed.
            Earn $KLIK just by creating NFTs here.
            You can also buy $KLIK on Uniswap.    
                           
            </p>
          </Reveal>



          <div className="spacer-30"></div>
          <h4 className='text-center color-yellow d-center d-row'>
            <div className='cursor-pointer' style={{ marginTop: -5, marginRight: 5 }}>Learn more</div>
            <i className="arrow_right bg-color-secondary cursor-pointer" style={{ fontSize: 27 }}></i>
          </h4>
        </div>

      </div>

      <br/><br/>

      <div className='d-center'>
        <div className='yellow-border'></div>
        <p className='color-yellow fw-semibold' style={{ fontSize: 20 }}>Each authentication burns $KLIK decreasing total supply. <b></b>
        Demand increases as more authentication services are requested by users doing due diligence on NFTs.</p>
      </div>

      <br/><br/>

      <div className='w-100 mt-30 d-flex flex-row justify-between'>
        {
          ICONS.map((item, index) => <ATOM key={index} item={item} />)
        }
      </div>
    </div>
  )
};

export default Governance;

function ATOM({ item }) {
  const { icon, title, description } = item;
  return (
    <div className='f-1 d-center'>
      <img src={icon} alt='icon'/>
      <div className='color-yellow text-center mt-20 fw-semibold' style={{ fontSize: 20 }}>{title}</div>
      <div className='text-center  fw-semibold'>{description}</div>
    </div>
  )
}

const ICONS = [
  {
    icon: 'img/icons/market.png',
    title: 'Market',
    description: 'Open market for tokens'
  },
  {
    icon: 'img/icons/burn.png',
    title: 'Burn',
    description: 'Remove for each authentication'
  },
  {
    icon: 'img/icons/increase.png',
    title: 'Increase',
    description: 'New supply for each new NFT'
  },
  {
    icon: 'img/icons/governance.png',
    title: 'Governance',
    description: 'Holders have voting rights'
  }
]