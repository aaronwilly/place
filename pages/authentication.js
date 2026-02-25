import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import clsx from 'clsx';
import Cryptr from 'cryptr'
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import NftCard from '../components/cards/NftCard';
import { Step4 } from '../components/loading';
import { useWeb3Auth } from '../services/web3auth';
import { onSaveRewards } from '../common/web3Api';
import { createVerification, getLazyMint, getReward, getVerification } from '../common/api/authApi';
import { handleRoute } from '../common/function';
import UtilService from '../sip/utilService';
import { PROD, VERIFY_PRICE } from '../keys';

const cryptr = new Cryptr('MetasaltSecret10');

const Title = styled.div`
  background: #6e7ea5;
  padding: 2px;
  font-size: 18px;
  color: #fff;

  @media only screen and (max-width: 600px) {
    padding: 4px;
    font-size: 12px;
  }
`

const AuthenticationPage = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, chain } = useWeb3Auth()
  const [tokenURI, setTokenURI] = useState('')
  const [rewards, setRewards] = useState(0)
  const [viewNFT, setViewNFT] = useState(null)
  const [myNFT, setMyNFT] = useState(null)

  const search = router.query.token
  const { nfts } = useSelector(state => state.nfts)
  const chainId = UtilService.getChain4(chain)
  const isEnabledMint = rewards - VERIFY_PRICE >= 0 && tokenURI

  const onGetRewards = useCallback(async () => {
    const response = await getReward({ owner: user?.account })
    const totalRewards = PROD ? (response?.ETH || 0) + (response?.POLYGON || 0) : (response?.GOERLI || 0) + (response?.MUMBAI || 0);
    setRewards(totalRewards)
  }, [user])

  useEffect(() => {
    onGetRewards().then()
  }, [onGetRewards, user])

  useEffect(() => {
    if (search) {
      setTokenURI(search)
    }
  }, [search])

  const onViewNFT = async () => {
    const nft = await getLazyMint({ token_id: tokenURI })

    if (nft) {
      const meta = JSON.parse(nft.metadata);
      const { image, chainId, description, price, name, isVideo, rate } = meta;
      setViewNFT({
        chainId,
        description,
        image,
        name,
        price,
        isVideo,
        rate,
        thumbnail: nft?.thumbnail
      });
    } else {
      dispatch(addNotification('Can\'t find NFT with this token URI.', 'error'))
    }
  }

  const onAuth = async () => {
    const response = await getVerification({ verifier: user?.account, tokenURI })
    const nft = nfts.find((item) => item.token_id === tokenURI);

    if (response) {
      dispatch(addNotification('You already authenticated this NFT!', 'error'))
      return false
    }

    if (nft) {
      const meta = JSON.parse(nft.metadata);
      let qrcode, myBrand = null;
      const decrypted = meta?.hashed ? await cryptr.decrypt(meta?.hashed) : null;

      if (decrypted) {
        const x = JSON.parse(decrypted)
        qrcode = x?.code
        myBrand = x.brand?.label
      }

      setMyNFT({
        category: myBrand, qrcode,
        title: meta.name,
        price: meta.price,
        counts: nft.amount
      });
      const request = { account: user?.account, chainId, counts: -1 }
      dispatch(onSaveRewards(request, () => { }))
      dispatch(addNotification('Authenticate successful', 'success'))

      await createVerification({
        price: VERIFY_PRICE,
        verifier: user?.account,
        tokenURI,
      })
    } else {
      dispatch(addNotification('We can\'t find this NFT!', 'error'))
    }
  }

  return (
    <LayoutPage>
      <LayoutScreen
        title='Authenticate your NFTs'
        description='Do your due diligence. Know that your NFT is not a counterfeit or fake.'
      >
        <section className="container color-b">
          <div className="row">
            <div className="col-lg-12">
              <Title className='text-center'>FOLLOW THE STEPS TO AUTHENTICATE</Title>

              <div className="d-flex flex-row-responsive">
                <div className="bg-2 d-flex f-1 flex-column stepBox">
                  <div className='height-160 d-flex flex-column align-items-center justify-content-center'>
                    <Step4 />
                    <div className='fs-20 fw-semibold' style={{ marginTop: 12, color: '#6e7ea5' }}>STEP 1:</div>
                    <div className='fs-18 fw-semibold color-b' style={{ marginTop: -5, marginBottom: 16 }}>
                      Klik Tokens
                    </div>
                  </div>
                  <div className="text-center d-flex f-1 flex-column" style={{ minHeight: 150 }}>
                    <div className="color-7 text-center">You have {rewards > 0 ? rewards : 0} Klik tokens</div>
                    {rewards - VERIFY_PRICE >= 0 ?
                      <p>Balance after authentication: <span className='fs-24 fw-semibold color-red'>{rewards - VERIFY_PRICE}</span></p>
                      :
                      <div>
                        <div className="alert alert-danger fs-14 text-center" style={{ marginTop: 20 }}>
                          Can't authenticate because you don't have enough $Klik tokens.
                          Please&nbsp;
                          <Link href={'/creator'} className='text-decoration-underline' prefetch={false}>create</Link>
                          &nbsp;at least one NFT before authentication or buy on&nbsp;
                          <Link href={'/$metasalttokens'} className='text-decoration-underline' prefetch={false}>UniSwap</Link>.
                          <br />
                        </div>
                      </div>
                    }
                    <p>Authentication Cost: <span className='fs-24 fw-semibold color-red'>{VERIFY_PRICE}</span> Klik tokens</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="box-btn1 btn-main" onClick={() => handleRoute(router, '/$metasalttokens')}>BUY KLIK</div>
                  </div>
                </div>
                <div className="bg-2 d-flex f-1 flex-column stepBox">
                  <div className='height-160 d-flex flex-column align-items-center justify-content-center'>
                    <Step4 />
                    <div className='fs-20 fw-semibold' style={{ marginTop: 12, color: '#6e7ea5' }}>STEP 2:</div>
                    <div className='fs-18 fw-semibold color-b' style={{ marginTop: -5, marginBottom: 16 }}>Input Token URI</div>
                  </div>
                  <div className="d-flex f-1 flex-column align-items-center justify-content-center">
                    <div className="text-center">Click on VIEW to confirm NFT details.</div>
                    <input
                      name="item_name"
                      id="item_name"
                      className="form-control mt-3"
                      placeholder="Input the token URI"
                      value={tokenURI}
                      onChange={(e) => setTokenURI(e.target.value)}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="box-btn1 btn-main" onClick={onViewNFT}>VIEW</div>
                  </div>
                </div>
                <div className="bg-2 d-flex f-1 flex-column stepBox">
                  <div className='height-160 d-flex flex-column align-items-center justify-content-center'>
                    <Step4 />
                    <div className='fs-20 fw-semibold' style={{ marginTop: 12, color: '#6e7ea5' }}>STEP 3:</div>
                    <div className='fs-18 fw-semibold color-b' style={{ marginTop: -5, marginBottom: 16 }}>NFT</div>
                  </div>
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 150 }}>
                    <NftCard
                      nft={{
                        title: viewNFT?.name,
                        description: viewNFT?.description,
                        preview_image_url: UtilService.ConvertImg(viewNFT?.image),
                        price: viewNFT?.price,
                        isVideo: viewNFT?.isVideo,
                        thumbnail: viewNFT?.thumbnail
                      }}
                      disableLink={true}
                      big={false}
                      favHidden
                      demo={true}
                    />
                    <input
                      type="button"
                      id="submit"
                      value="AUTHENTICATE"
                      onClick={onAuth}
                      className={clsx('btn-main box-btn1', !isEnabledMint && 'btn-disabled')}
                    />
                  </div>
                </div>
                <div className="bg-2 d-flex f-1 flex-column stepBox" style={{ maxWidth: 300 }}>
                  <div className='height-160 d-flex flex-column align-items-center justify-content-center'>
                    <Step4 />
                    <div className='fs-20 fw-semibold' style={{ marginTop: 12, color: '#6e7ea5' }}>STEP 4:</div>
                    <div className='fs-18 fw-semibold color-b' style={{ marginTop: -5, marginBottom: 16 }}>Result</div>
                  </div>
                  <div className="d-flex f-1 align-items-center justify-content-center">
                    {myNFT ?
                      <div className="color-7 overflow-hidden" style={{ maxWidth: 270 }}>
                        <h5 className="color-7 text-center">
                          QR Code:
                          <span className='fs-14 fw-normal text-break'>
                            <br /><br />
                            {myNFT.qrcode ||
                              <QRCode
                                size={170}
                                value={JSON.stringify({
                                  title: myNFT?.title,
                                  price: myNFT?.price,
                                  counts: myNFT?.counts
                                })}
                              />
                            }
                          </span>
                        </h5>
                        <br />
                        <h5 className="color-7 text-center">Brand: <span className='fs-14 fw-normal'>{myNFT?.category}</span></h5>
                        <br /><br />
                        <div className="spacer-30" />
                        <br />
                      </div>
                      :
                      <></>
                    }
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="box-btn1 btn-main" onClick={() => handleRoute(router, '/nftmarketplace')}>MARKETPLACE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default AuthenticationPage;
