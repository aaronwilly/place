import React from 'react';
import { useWeb3Auth } from '../../../services/web3auth';
import UtilService from '../../../sip/utilService';
import LayoutModal from '../../layouts/layoutModal';

const ModalPriceLacks = ({ onClose, price }) => {

  const { chain } = useWeb3Auth();
  const chainId = UtilService.getChain4(chain);

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Add funds to purchase'}
    >

      <div className="divider"/><br/>

      <p className="fs-20 fw-semibold text-center">You need {price} {UtilService.getChain3(chainId)} + <span className="color-sky"> gas fees </span></p>

      <p className="text-center" style={{ fontSize: 18 }}>Transfer funds to your wallet or add funds with a card. It can take up to a minute for your balance to update.</p>

      <div className="divider"/><br/>

      <div className="row" style={{ justifyContent: 'center' }}>

        <div className="offer-btn buy-btn" style={{ width: 200, opacity: 0.4 }}>
          Continue
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalPriceLacks;