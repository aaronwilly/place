import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import ModalRewardDisable from '../components/modals/modalRewardDisable';
import { TinyLoading } from '../components/loading';
import { useWeb3Auth } from '../services/web3auth';
import { getReward } from '../common/api/authApi';
import { handleRoute } from '../common/function';
import UtilService from '../sip/utilService';
import { PROD } from '../keys';

const erc20ABI = require('../constants/abis/erc20ABI.json');

export const Text = styled.div`
  font-size: 28px;
  
  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`
export const Row = styled.div`
  width: 650px;
  padding: 4px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  @media only screen and (max-width: 600px) {
    width: 350px;
  }
`

const Reward = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, chain } = useWeb3Auth()
  const chainId = UtilService.getChain4(chain)

  const [rewards1, setRewards1] = useState(0);
  const [rewards2, setRewards2] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const web3 = new Web3((typeof window !== 'undefined' && window).ethereum);
  const erc = new web3.eth.Contract(erc20ABI.abi, UtilService.getERC20Address(chainId));

  useEffect(() => {
    setTimeout(() => {
      onGetVirtualRewards().then()
      user?.account && onGetBalanceOf();
      user?.account && onGetBlockchainRewards();
    }, 1000)
  }, [user])

  const onGetVirtualRewards = async () => {
    const reward = await getReward({ owner: user?.account || user?._id })
    const totalRewards = PROD ? (reward?.ETH || 0) + (reward?.POLYGON || 0) : (reward?.GOERLI || 0) + (reward?.MUMBAI || 0);
    setRewards1(totalRewards)
  }

  const onGetBalanceOf = async () => {
    const res = await erc.methods?.balanceOf(user?.account).call();
    setRewards2(res / 1000000000000000000)
  }

  const onGetBlockchainRewards = async () => {
    const res = await erc.methods?.getReward(user?.account).call();
    if (res !== '0') {
      setRewardAmount(res / 1000000000000000000)
    } else {
      setRewardAmount(0);
    }
  }

  const onClaimReward = () => {
    if (rewardAmount === 0) {
      setIsModal(true);
      return false;
    } else {
      onClaim().then()
    }
  }

  const onClaim = async () => {
    setLoading(true);
    try {
      await erc.methods?.claimCreatingReward().call();
      setTimeout(() => {
        onGetBalanceOf();
        onGetBlockchainRewards();
        setLoading(false);
      }, 2000)
    } catch (e) {
      setLoading(false);
      dispatch(addNotification('Not enough reward balance', 'error'))
    }
  }

  return (
    <LayoutPage>
      <LayoutScreen title='REWARDS' description='$KLIK TOKENS'>
        <div className='mt-5 color-b d-flex flex-column align-items-center justify-content-center'>
          <Row>
            <Text>TOKENS IN YOUR ACCOUNT</Text>
            <Text>{rewards1 || 0}</Text>
          </Row>

          <Row>
            <div className='-mt-10 text-start color-7'>
              The number of $KLIK tokens you have in your Klik account earned by minting NFTs onto the blockchain. These tokens can be used to
              <span className='color-sky cursor-pointer' onClick={() => handleRoute(router, '/authentication')}> authenticate </span> NFTs or be sold on
              <span className='color-sky cursor-pointer' onClick={() => handleRoute(router, '/buyethereum')}> Uniswap</span>.
            </div>
          </Row>

          <Row className='mt-5'>
            <Text>TOKENS IN YOUR WALLET</Text>
            <Text>{rewards2 || 0}</Text>
          </Row>

          <Row>
            <div className='-mt-10 color-7 text-start'>
              The number of $KLIK tokens you have in your wallet that you claimed as a reward or that you bought from <span className='color-sky cursor-pointer' onClick={() => handleRoute(router, '/buyethereum')}>Uniswap</span>.
              If you want to <span className='color-sky cursor-pointer' onClick={() => handleRoute(router, '/authentication')}> authenticate </span> NFTs, you must use $KLIK tokens.
            </div>
          </Row>

          {!loading && <div className='mt-5 btn-main' onClick={onClaimReward}>Claim Reward {rewardAmount || 0}</div>}
          {loading && <div className='mt-5'><TinyLoading /></div>}
        </div>

        <ModalRewardDisable open={isModal} onClose={() => setIsModal(false)} />
      </LayoutScreen>
    </LayoutPage>
  );
}

export default Reward;
