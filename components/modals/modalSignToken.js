import { useRouter } from 'next/router';
import React from 'react';
import Modal from 'react-modal';
import useWindowSize from '../../hooks/useWindowSize';
import { useWeb3Auth } from '../../services/web3auth';
import { createTermsAccepted } from '../../common/api/authApi';

const ModalSignToken = ({ onClose }) => {

  const router = useRouter()
  const { width } = useWindowSize()
  const { user } = useWeb3Auth()

  const onSwitchNetwork = async () => {
    onClose()
    await createTermsAccepted({
      owner: user?.account,
      agreed: true
    })
    router.push('/$metasalttokens', undefined, { shallow: true }).then()
  }

  return (
    <Modal isOpen={true} style={width > 900 ? windowStyles : mobileStyles} onRequestClose={onClose}>
      <span aria-hidden="true" className="icon_close_alt2 right-icon" onClick={onClose}/>
      <h3 className="text-center color-b">Connect to see your balances</h3>
      <div className="divider" />
      <br />
      <p className='fw-semibold' style={{ fontSize: 17, color: '#bbb' }}>Supported transactions:</p>
      <p style={{ fontSize: 14, color: '#bbb' }}>
        Buy and sell $KLIK tokens on Uniswap<br />
        Buy Ethereum using a Credit Card by clicking on the Fiat link <br />
        Carefully read all messages when making transactions. <br /><br />
        To proceed click "I agree"
      </p>
      <div className="row justify-content-center">
        <div className="offer-btn buy-btn" style={{ width: 120, height: 40 }} onClick={onSwitchNetwork}>
          I agree
        </div>
      </div>
    </Modal>
  );
};

export default ModalSignToken;

const windowStyles = {
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    width: 580,
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
  },
};

const mobileStyles = {
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    height: 500,
    width: 'calc(100% - 30px)',
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
  },
};