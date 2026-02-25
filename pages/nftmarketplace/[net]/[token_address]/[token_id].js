import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import QRCode from 'react-qr-code';
import { Alchemy } from 'alchemy-sdk';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../../store/actions/notifications/notifications';
import LayoutPage from '../../../../components/layouts/layoutPage';
import LayoutModal from '../../../../components/layouts/layoutModal';
import ItemLeft from '../../../../atoms/itemDetail/itemLeft';
import ItemRightHeader from '../../../../atoms/itemDetail/itemRightHeader';
import ItemRequest from '../../../../atoms/itemDetail/itemRequest';
import ItemActivity from '../../../../atoms/itemDetail/itemActivity';
import ItemSell from '../../../../atoms/itemDetail/itemSell';
import ItemStopSale from '../../../../atoms/itemDetail/itemStopSale';
import ItemBuy from '../../../../atoms/itemDetail/itemBuy';
import ItemRequestOrder from '../../../../atoms/itemDetail/itemRequestOrder';
import ModalHideNFT from '../../../../components/modals/modalHideNFT';
import ModalDeleteNFT from '../../../../components/modals/modalDeleteNFT';
import ModalTransferNFT from '../../../../components/modals/social/modalTransferNFT';
import ModalSwitchNetwork from '../../../../components/modals/warnings/modalSwitchNetwork';
import { MetaTag } from '../../../../components/MetaTag';
import usePrice from '../../../../hooks/usePrice';
import { useWeb3Auth } from '../../../../services/web3auth';
import {
  checkTransferRequest,
  GetBrand,
  GetNFTMarketplaceDetailPageData,
  GetUser,
  GetVerification,
  transferRequest
} from '../../../../common/api/noAuthApi';
import UtilService from '../../../../sip/utilService';
import { ALCHEMY_KEY } from '../../../../keys';

const FinalPrice = styled.div`
  font-size: 40px;
  font-weight: 500;
  color: #bbb;

  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`

const ICON = styled.img`
  height: 80px;

  @media only screen and (max-width: 700px) {
    height: 40px;
  }
`

const ICONBox = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 30px;

  @media only screen and (max-width: 600px) {
    display: block;
  }
`


const NftDetail = (props) => {

  const {
    userAgent,
    net,
    token_address,
    ercTokenId,
    image,
    name,
    description,
    isERC1155,
    totalSupply,
    lazyMintByTokenId,
    hiddenData,
    lazyMintTransfers,
    requestOrdersByTokenId,
    orderDataByTokenId
  } = props;

  const dispatch = useDispatch();
  const { user, isAuthenticated, allUsers, login } = useWeb3Auth()
  const { eth: ethPrice, matic: maticPrice } = usePrice()
  const [myNFT, setMyNFT] = useState(null)
  const [switchNetworkModal, setSwitchNetworkModal] = useState(false)
  const [changedPrice, setChangedPrice] = useState()
  const [brand, setBrand] = useState(null)
  const [isCongrat, setIsCongrat] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const [isRemoveModal, setIsRemoveModal] = useState(false)
  const [isTransferModal, setIsTransferModal] = useState(false)
  const [isHideModal, setIsHideModal] = useState(false)
  const [verificationData, setVerificationData] = useState(null)
  const [openAppModal, setOpenAppModal] = useState(false);

  const account = user?.account
  const price = (net === 'polygon' || net === 'mumbai') ? maticPrice : ethPrice

  const acceptedData = useMemo(() => {
    const result = requestOrdersByTokenId.find(item => item.requestor === account)
    return result || null
  }, [account, requestOrdersByTokenId])

  const me = allUsers?.find(z => z.account === myNFT?.owner_of);
  const createdOrder = useMemo(() => orderDataByTokenId.find(item => item?.completed !== true), [orderDataByTokenId])
  const qrLink = `https://klik.cool/nftmarketplace/${net}/${token_address}/${ercTokenId}`;

  useEffect(() => {
    if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
      setOpenAppModal(true);
    }
  }, [])

  const openApp = () => {
    window.location.href = `metasalt://nftmarketplace/${net}/${token_address}/${ercTokenId}`;
  };

  const redirectToAppStore = () => {
    if (userAgent.match(/Android/i) || userAgent.match(/iPhone|iPad|iPod/i)) {
      window.location.replace('https://onelink.to/gfnq8n');
    }
  };

  const onGetNFT = useCallback(async () => {
    if (ercTokenId && token_address && lazyMintByTokenId) {
      setMyNFT({
        ...lazyMintByTokenId,
        owner_of: lazyMintByTokenId?.owner || lazyMintByTokenId?.creator,
        create_of: lazyMintByTokenId?.creator
      })
    } else {
      onGetGlobalNFT().then()
    }
  }, [ercTokenId, token_address, lazyMintByTokenId])

  useEffect(() => {
    onGetNFT().then()
  }, [onGetNFT])

  useEffect(() => {
    if (brandObject) onGetBrand(brandObject);
  }, [myNFT])

  useEffect(() => {
    const loadVerificationData = async () => {
      const response = await GetVerification({ verifier: account, tokenURI: ercTokenId })
      response && setVerificationData(response)
    }

    if (account && ercTokenId) loadVerificationData();
  }, [account, ercTokenId])

  const creatorAddress = myNFT?.create_of || myNFT?.owner_of;

  const digital_tokenId = UtilService.checkHexa(ercTokenId) ? UtilService.DecimalToHex(ercTokenId) : ercTokenId;

  const onGetGlobalNFT = async () => {

    const alchemy = new Alchemy({
      apiKey: ALCHEMY_KEY,
      network: UtilService.alchemyNet(net),
    });

    try {
      const data = await alchemy.nft.getNftMetadata(token_address, digital_tokenId)
      const OwnersForNft = await alchemy.nft.getOwnersForNft(token_address, digital_tokenId)
      const owner_of = OwnersForNft?.owners[0];
      const ownerData = allUsers.find(c => c.account?.toLowerCase() === owner_of)

      setMyNFT({
        token_id: data.tokenId,
        amount: data?.balance,
        contract_type: data.tokenType,
        last_metadata_sync: data.timeLastUpdated,
        last_token_uri_sync: data.timeLastUpdated,
        metadata: JSON.stringify(data.rawMetadata),
        owner_of: ownerData || owner_of,
        symbol: data.contract.symbol,
        token_address: data.contract.address,
      });
    } catch (e) {}
  }

  const priceChain = UtilService.getChain4(net)
  const brandObject = myNFT?.metadata && JSON.parse(myNFT?.metadata)?.brand;
  const finalPrice = createdOrder ? (createdOrder.price || price) : (changedPrice);
  const privateSale = myNFT?.privateSale || false;
  const isMine = account && (myNFT?.owner_of?.account?.toLowerCase() === account || myNFT?.owner_of === account);

  const onGetBrand = async (x) => {
    const response = await GetBrand({ _id: x.value || x })
    response && setBrand({ ...response, id: response._id })
  }

  const onRequestToken = async () => {
    if (userAgent.match(/iPhone|iPad|iPod/i) || userAgent.match(/Android/i)) {
      setOpenAppModal(true);
    } else {
      if (!isAuthenticated) {
        return login();
      }

      const response1 = await checkTransferRequest({
        lazyMintId: lazyMintByTokenId?._id,
        owner: lazyMintByTokenId?.owner,
        account: user?.account,
      });

      if (response1?.availability) {
        const request = {
          itemUrl: `https://klik.cool/nftmarketplace/eth/${token_address}/${ercTokenId}`,
          image: UtilService.ConvertImg(image),
          lazyMintId: lazyMintByTokenId?._id,
          owner: lazyMintByTokenId?.owner,
          ownerUrl: `https://klik.cool/sales/${lazyMintByTokenId?.owner}`,
          account: user?.account,
        };

        const response2 = await transferRequest(request);
        if (response2.success) dispatch(addNotification('Transfer request was sent successfully'));
      } else {
        dispatch(addNotification('You already sent the request message!'));
      }
    }
  }

  const handleOpenApp = () => {
    setOpenAppModal(false);
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
  }

  return (
    <div>
      <MetaTag {...{ title: name, description: description, image: UtilService.ConvertImg(image) }} />
      <LayoutPage congrat={isCongrat}>
        <div className="mb-5 d-flex align-items-center justify-content-center">
          <div className='row container mt-5'>
            <div className="col-md-5 text-center pt-18 position-relative">
              <ItemLeft
                myNFT={myNFT}
                brand={brand}
                totalSupply={totalSupply}
                sales={[]}
                creatorAddress={creatorAddress}
                verificationData={verificationData}
                orderDataByTokenId={orderDataByTokenId}
              />
            </div>

            <div className="col-md-7">
              <div className="item_info">
                <ItemRightHeader myNFT={myNFT} brand={brand} creator={myNFT?.creator} totalSupply={totalSupply} />
                <div className='offer-card mt-20'>

                  {myNFT ? <div>
                    {<div className="d-flex flex-row align-items-center">
                      {finalPrice && <FinalPrice>
                        {finalPrice || ''}&nbsp;
                        {UtilService.getPriceUnit(priceChain)}
                      </FinalPrice>}
                    </div>}

                    {finalPrice && <div className="color-b"> ${(finalPrice * price)?.toFixed(2)} USD</div>}
                  </div> : <Skeleton height={50} />}

                  {myNFT ? <div>
                    {
                      (isMine && (!createdOrder || createdOrder.maker?.toLowerCase() !== account)) &&
                      <ItemSell {...{
                        changedPrice,
                        setChangedPrice,
                        setSwitchNetworkModal,
                        myNFT,
                        lazyMintByTokenId,
                        orderDataByTokenId
                      }} />
                    }

                    {
                      (isMine && createdOrder && createdOrder.makerId?.toLowerCase() === account) &&
                      <ItemStopSale {...{ setSwitchNetworkModal, priceChain, orderDataByTokenId }} />
                    }

                    {
                      ((myNFT?.owner_of?.account?.toLowerCase() || myNFT?.owner_of) !== account) && createdOrder && (acceptedData?.confirmed || !privateSale) &&
                      <ItemBuy {...{
                        me,
                        changedPrice,
                        setSwitchNetworkModal,
                        myNFT,
                        setIsCongrat,
                        lazyMintByTokenId,
                        orderDataByTokenId
                      }} />
                    }

                    {
                      myNFT?.owner_of !== account && createdOrder && privateSale &&
                      <ItemRequestOrder {...{ requestOrdersByTokenId }} />
                    }

                    <div className={`offer-btn ${verificationData && 'disable-btn'}`} onClick={onRequestToken}>Request Token</div>
                  </div> : <div>
                    <Skeleton height={30} />
                    <Skeleton height={30} />
                    <Skeleton height={30} />
                  </div>}

                </div>

                {isMine && <ItemRequest requestOrdersByTokenId={requestOrdersByTokenId} />}

                <ItemActivity {...{ sales: [], lazyMintTransfers }} />

                {
                  myNFT?.lazyMint && isMine &&
                  <div className={`btn bg-primary mt-4 ${createdOrder && 'btn-disabled'}`} onClick={() => setIsTransferModal(true)}>
                    <span className="color-b">Transfer NFT</span>
                  </div>
                }

                {
                  isMine &&
                  <div className={'btn bg-secondary ml-2 mt-4'} onClick={() => setIsHideModal(true)}>
                    <span className="color-b">{hiddenData ? 'Enable' : 'Hide'} NFT</span>
                  </div>
                }

                {
                  myNFT?.lazyMint && isMine &&
                  <div className={`btn bg-red ml-2 mt-4 ${createdOrder && 'btn-disabled'}`} onClick={() => setIsRemoveModal(true)}>
                    Remove NFT
                  </div>
                }

                <div className='mt-4 d-flex'>
                  <div className='p-3 bg-white'>
                    <QRCode value={qrLink} size={150} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {switchNetworkModal && <ModalSwitchNetwork isOpen={switchNetworkModal} network={priceChain} onClose={() => setSwitchNetworkModal(false)} />}

        {isRemoveModal && <ModalDeleteNFT isOpen={isRemoveModal} onClose={() => setIsRemoveModal(false)} />}

        {isHideModal && <ModalHideNFT isOpen={isHideModal} hidden={!!hiddenData} onClose={() => setIsHideModal(false)} onSuccess={() => setTrigger(trigger + 1)} />}

        {isTransferModal && <ModalTransferNFT isOpen={isTransferModal} onClose={() => setIsTransferModal(false)} isERC1155={isERC1155} />}

        <ICONBox>
          <a target='_blank' rel="noreferrer" href='https://play.google.com/store/apps/details?id=com.klikmobile'>
            <ICON src='../../../img/other/playstore.png' className='m-2 cursor-pointer' />
          </a>
          <a target='_blank' rel="noreferrer" href='https://apps.apple.com/ph/app/klik-social/id6471041690?platform=iphone'>
            <ICON src='../../../img/other/appstore.png' className='m-2 cursor-pointer' />
          </a>
        </ICONBox>
      </LayoutPage>

      <LayoutModal
        isOpen={openAppModal}
        title='Do you want to open this page in the app?'
        hiddenClose={true}
      >
        <div className='w-100' style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div className='offer-btn bg-primary color-white' onClick={() => setOpenAppModal(false)}>No</div>
          <div className='offer-btn bg-primary color-white' onClick={() => handleOpenApp()}>Yes</div>
        </div>
      </LayoutModal>
    </div>
  );
}

export const getServerSideProps = async ({ req, res, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

  const { net, token_address, token_id } = query;

  const MAIN_MINT1155_ADDRESS = '0xa8aba6bb110745e079ad90cbbaf62102c8ba80fe'
  const GOERLI_MINT1155_ADDRESS = '0xee3a7c32b0e104ffa8e6384d0db1c9a21727aa9b'
  const isERC1155 = [MAIN_MINT1155_ADDRESS.toLowerCase(), GOERLI_MINT1155_ADDRESS.toLowerCase()].includes(token_address?.toLowerCase())

  const response = await GetNFTMarketplaceDetailPageData(query)
  const lazyMint = response?.lazyMint
  const response1 = response?.mintSupply
  const response2 = response?.hideNFT
  const response4 = response?.lazyMintTransfers
  const response5 = response?.requestOrders
  const response6 = response?.orderData

  const totalSupply = response1?.supply || 1
  let creator = response1?.creator || null

  let name, description, image
  if (lazyMint) {
    const { thumbnail, metadata } = lazyMint
    const response = JSON.parse(metadata)

    name = response.name || ''
    description = response.description || ''
    image = thumbnail || response.image || ''
  } else {

    const alchemy = new Alchemy({
      apiKey: ALCHEMY_KEY,
      network: UtilService.alchemyNet(net),
    });

    const response = await alchemy.nft.getNftMetadata(token_address, token_id)

    const response7 = await GetUser({ account: response?.owner_of })
    if (response7) creator = response7

    name = response?.rawMetadata?.name || null
    description = response?.rawMetadata?.description || null
    image = UtilService.ConvertImg(response?.rawMetadata?.image) || null
  }

  return {
    props: {
      userAgent,
      net,
      token_address,
      ercTokenId: token_id,
      isERC1155,
      totalSupply,
      creator,
      name,
      description,
      image,
      lazyMintByTokenId: lazyMint || null,
      hiddenData: response2 || null,
      lazyMintTransfers: response4 || [],
      requestOrdersByTokenId: response5 || [],
      orderDataByTokenId: response6 || [],
    }
  }
}

export default NftDetail;
