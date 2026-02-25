import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import ModalPurchaseProcessing from '../../components/modals/modalPurchaseProcessing';
import ModalUnreviewedCollection from '../../components/modals/modalUnreviewedCollection';
import ModalPriceLacks from '../../components/modals/warnings/modalPriceLacks';
import { Loading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import { onSaveRewards } from '../../common/web3Api';
import { updateLazyMint, updateOrderData } from '../../common/api/authApi';
import { Asset, Enc, EncLazyMint1155Data, EncLazyMint721Data, ERC1155, ERC1155_LAZY, ERC721, ERC721_LAZY, ETH, Order, SignOrder, ZERO } from '../../sip/LazymintConfig';
import UtilService from '../../sip/utilService';
import WertModule from '@wert-io/module-react-component';
import { signSmartContractData } from '@wert-io/widget-sc-signer';
import LayoutModal from '../../components/layouts/layoutModal';
import { v4 as uuidv4 } from 'uuid';
import { handleRoute } from '../../common/function';
import { PROD, WERT_COMMODITIES_PROD, WERT_COMMODITIES_TEST, WERT_ORIGIN_PROD, WERT_ORIGIN_TEST, WERT_PARTNER_PROD, WERT_PARTNER_TEST, WERT_PRIVATE_KEY_PROD, WERT_PRIVATE_KEY_TEST } from '../../keys';

const newMarketplaceABI = require('../../constants/abis/marketplaceABI.json');

const ItemBuy = ({
  myNFT,
  changedPrice,
  me,
  setSwitchNetworkModal,
  setIsCongrat,
  lazyMintByTokenId: lazyMint,
  orderDataByTokenId,
}) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { token_id: ercTokenId, token_address, net } = router.query;
  const { user, isAuthenticated, chain, web3Auth, allUsers: users, login } = useWeb3Auth()
  const chainId = UtilService.getChain4(chain);
  const account = user?.account;

  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isModalPriceLacks, setIsModalPriceLacks] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(0);
  const [isReviewCollectionModal, setIsReviewCollectionModal] = useState(false);
  const [wertConfig, setWertConfig] = useState(null); // isCard payment
  const [isPayModal, setIsPayModal] = useState(false);

  const createdOrder = useMemo(() => orderDataByTokenId.find(item => item?.completed === false), [orderDataByTokenId])
  const mPrice = useMemo(() => orderDataByTokenId.length && orderDataByTokenId[0]?.price?.toString(), [orderDataByTokenId])
  const SALECOUNTS = Number(createdOrder?.saleCounts || 1);

  const {
    image,
    name,
    rate,
    isVideo,
    category,
    royalties: royal,
  } = (myNFT?.metadata && JSON.parse(myNFT?.metadata)) || '-'
  const royalties = royal || '0'; // default royaltee is 0

  const priceChain = UtilService.getChain4(net);
  const price = myNFT?.metadata && JSON.parse(myNFT?.metadata)?.price?.toString();

  // let isLazyMint = myNFT?.lazyMint || lazyMint?._id !== null ;
  let isLazyMint = myNFT?.lazyMint;

  const creatorObject = lazyMint?.creator ? users?.find(z => (z.account) === lazyMint?.creator) : null;

  const finalPrice = createdOrder ? (createdOrder.price || price) : (changedPrice || mPrice || price);
  const type = myNFT?.contract_type || 'ERC721';
  const supply = myNFT?.supply || 1;
  const amount = myNFT?.amount || 1;

  const onBuyOrderValidation = async () => {

    if (!isAuthenticated) {
      login().then()
      return false;
    }

    if (priceChain !== chainId) {
      setSwitchNetworkModal(true);
      return false;
    }

    setIsReviewCollectionModal(true);
  }

  const onBuyOrder = async (isCardPay) => {

    const web3authProvider = await web3Auth.connect();
    const web3 = new Web3(web3authProvider);

    // checking your balance if it is eth
    if(!isCardPay){
      const bal = await web3.eth.getBalance(user?.account);
      const balance = web3.utils.fromWei(bal, 'ether')
  
      if (Number(finalPrice) > balance) {
        setIsModalPriceLacks(true);
        return false;
      }
    }

    setPurchaseStatus(1);

    const MINT_PRICE = web3.utils.toWei((finalPrice * SALECOUNTS).toString() || '0.001');
    const MINT_PRICE_WEI = (finalPrice * SALECOUNTS).toString() || '0.001';

    let right;
    if (type === 'ERC721') {
      if (isLazyMint) {
        const encodedMintData = await EncLazyMint721Data(web3, token_address, ercTokenId, lazyMint?.tokenURI, lazyMint?.creator?.account, royalties, lazyMint?.signature);
        right = Order(user?.account, Asset(ETH, '0x', MINT_PRICE), ZERO, Asset(ERC721_LAZY, encodedMintData, 1), '0x');
      } else {
        right = Order(user?.account, Asset(ETH, '0x', MINT_PRICE), ZERO, Asset(ERC721, Enc(web3, token_address, ercTokenId), 1), '0x');
      }
    } else {
      if (isLazyMint) {
        const encodedMintData = await EncLazyMint1155Data(web3, token_address, ercTokenId, lazyMint?.tokenURI, supply, lazyMint?.creator?.account, royalties, lazyMint?.signature);
        right = Order(user?.account, Asset(ETH, '0x', MINT_PRICE), ZERO, Asset(ERC1155_LAZY, encodedMintData, SALECOUNTS), '0x');
      } else {
        right = Order(user?.account, Asset(ETH, '0x', MINT_PRICE), ZERO, Asset(ERC1155, Enc(web3, token_address, ercTokenId), SALECOUNTS), '0x');
      }
    }

    const signatureRight = await SignOrder(web3, right, user?.account, UtilService.getMarketAddress(chainId));

    const orderLeft = {
      maker: createdOrder.makerId,
      taker: createdOrder.taker,
      data: createdOrder.data,
      makeAsset: {
        value: createdOrder.makeAsset_value,
        assetType: {
          assetClass: createdOrder.makeAsset_assetType_assetClass,
          data: createdOrder.makeAsset_assetType_data
        }
      },
      takeAsset: {
        value: MINT_PRICE,
        assetType: {
          assetClass: createdOrder.takeAsset_assetType_assetClass,
          data: createdOrder.takeAsset_assetType_data
        }
      }
    }

    try {

      const request = {
        web3, orderLeft, createdOrder, right, signatureRight, MINT_PRICE, MINT_PRICE_WEI
      }

      if (isCardPay) {
        onCardPay(request)
      } else {
        onCryptoPay(request);
      }

    } catch (e) {
      dispatch(addNotification('Transaction failed!', 'error'))
      console.log('e =================> ', e)
      setIsFullLoading(false);
      setPurchaseStatus(0);
    }

  }

  const onCryptoPay = async (request) => {
    const { web3, orderLeft, createdOrder, right, signatureRight, MINT_PRICE } = request;
    const contract = new web3.eth.Contract(newMarketplaceABI.abi, UtilService.getMarketAddress(chainId), account);

    try {
      await contract.methods.matchOrders(orderLeft, createdOrder.signatureLeft, right, signatureRight)
        .send({ from: account, value: MINT_PRICE })
        .on('transactionHash', () => { })
        .then(() => onBuySuccess())
    } catch (e) {
      setPurchaseStatus(0)
      console.log('e ======> ', e)
    }

  }

  const onCardPay = async (request) => {

    const { web3, orderLeft, createdOrder, right, signatureRight, MINT_PRICE_WEI } = request;
    const sc_input_data = web3.eth.abi.encodeFunctionCall({
      'inputs': [
        {
          'components': [
            {
              'internalType': 'address',
              'name': 'maker',
              'type': 'address'
            },
            {
              'components': [
                {
                  'components': [
                    {
                      'internalType': 'bytes4',
                      'name': 'assetClass',
                      'type': 'bytes4'
                    },
                    {
                      'internalType': 'bytes',
                      'name': 'data',
                      'type': 'bytes'
                    }
                  ],
                  'internalType': 'struct LibAsset.AssetType',
                  'name': 'assetType',
                  'type': 'tuple'
                },
                {
                  'internalType': 'uint256',
                  'name': 'value',
                  'type': 'uint256'
                }
              ],
              'internalType': 'struct LibAsset.Asset',
              'name': 'makeAsset',
              'type': 'tuple'
            },
            {
              'internalType': 'address',
              'name': 'taker',
              'type': 'address'
            },
            {
              'components': [
                {
                  'components': [
                    {
                      'internalType': 'bytes4',
                      'name': 'assetClass',
                      'type': 'bytes4'
                    },
                    {
                      'internalType': 'bytes',
                      'name': 'data',
                      'type': 'bytes'
                    }
                  ],
                  'internalType': 'struct LibAsset.AssetType',
                  'name': 'assetType',
                  'type': 'tuple'
                },
                {
                  'internalType': 'uint256',
                  'name': 'value',
                  'type': 'uint256'
                }
              ],
              'internalType': 'struct LibAsset.Asset',
              'name': 'takeAsset',
              'type': 'tuple'
            },
            {
              'internalType': 'bytes',
              'name': 'data',
              'type': 'bytes'
            }
          ],
          'internalType': 'struct LibOrder.Order',
          'name': 'orderLeft',
          'type': 'tuple'
        },
        {
          'internalType': 'bytes',
          'name': 'signatureLeft',
          'type': 'bytes'
        },
        {
          'components': [
            {
              'internalType': 'address',
              'name': 'maker',
              'type': 'address'
            },
            {
              'components': [
                {
                  'components': [
                    {
                      'internalType': 'bytes4',
                      'name': 'assetClass',
                      'type': 'bytes4'
                    },
                    {
                      'internalType': 'bytes',
                      'name': 'data',
                      'type': 'bytes'
                    }
                  ],
                  'internalType': 'struct LibAsset.AssetType',
                  'name': 'assetType',
                  'type': 'tuple'
                },
                {
                  'internalType': 'uint256',
                  'name': 'value',
                  'type': 'uint256'
                }
              ],
              'internalType': 'struct LibAsset.Asset',
              'name': 'makeAsset',
              'type': 'tuple'
            },
            {
              'internalType': 'address',
              'name': 'taker',
              'type': 'address'
            },
            {
              'components': [
                {
                  'components': [
                    {
                      'internalType': 'bytes4',
                      'name': 'assetClass',
                      'type': 'bytes4'
                    },
                    {
                      'internalType': 'bytes',
                      'name': 'data',
                      'type': 'bytes'
                    }
                  ],
                  'internalType': 'struct LibAsset.AssetType',
                  'name': 'assetType',
                  'type': 'tuple'
                },
                {
                  'internalType': 'uint256',
                  'name': 'value',
                  'type': 'uint256'
                }
              ],
              'internalType': 'struct LibAsset.Asset',
              'name': 'takeAsset',
              'type': 'tuple'
            },
            {
              'internalType': 'bytes',
              'name': 'data',
              'type': 'bytes'
            }
          ],
          'internalType': 'struct LibOrder.Order',
          'name': 'orderRight',
          'type': 'tuple'
        },
        {
          'internalType': 'bytes',
          'name': 'signatureRight',
          'type': 'bytes'
        }
      ],
      'name': 'matchOrdersByProcessor',
      'outputs': [],
      'stateMutability': 'payable',
      'type': 'function',
      'payable': true
    }, [orderLeft, createdOrder.signatureLeft, right, signatureRight]);

    const privateKey = PROD ? WERT_PRIVATE_KEY_PROD : WERT_PRIVATE_KEY_TEST;
    const accounts = web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log('accounts', accounts);
    const sc_id = uuidv4();

    const signedData = signSmartContractData({
      address: account, // user's address
      commodity: 'ETH',
      commodity_amount: MINT_PRICE_WEI, // the crypto amount that should be send to the contract method,
      network: PROD ? 'ethereum' : 'goerli',
      sc_address: UtilService.getMarketAddress(chainId), // your SC address
      sc_input_data,
    }, privateKey);

    console.log('signedData params: ', {
      address: account, // user's address
      commodity: PROD ? WERT_COMMODITIES_PROD : WERT_COMMODITIES_TEST,
      commodity_amount: MINT_PRICE_WEI, // the crypto amount that should be send to the contract method
      network: PROD ? 'ethereum' : 'goerli',
      sc_address: UtilService.getMarketAddress(chainId), // your SC address
      sc_input_data,
    })

    const signature = signedData?.signature;
    console.log('signature: ', signature)

    const wertOptions = {
      partner_id: PROD ? WERT_PARTNER_PROD : WERT_PARTNER_TEST,
      click_id: uuidv4(), // unique id of purhase in your system
      origin: PROD ? WERT_ORIGIN_PROD : WERT_ORIGIN_TEST,
      width: 400,
      height: 600,
      theme: 'dark',
      address: account,
      // commodity: 'ETH',
      // network: 'ethereum',
      commodities: PROD ? WERT_COMMODITIES_PROD : WERT_COMMODITIES_TEST,
      commodity_amount: MINT_PRICE_WEI,
      sc_address: UtilService.getMarketAddress(chainId),
      // sc_id,
      sc_input_data,
      signature,
      color_buttons: '#ff4b7e',
      buttons_border_radius: '99',
      color_background: '#222',
      listeners: {
        loaded: () => console.log('loaded'),
        'payment-status': data => {
          console.log('Payment status:', data)
          if (data.status === 'success') {
            onBuySuccess();
          }
        }
      },
    }
    console.log('wertOptions: ', wertOptions)

    setWertConfig(wertOptions);
  }

  const onBuySuccess = async () => {
    dispatch(addNotification('Transaction confirmed!', 'success'))
    setIsCongrat(true);

    orderDataByTokenId.length && await updateOrderData({
      _id: orderDataByTokenId[0]._id,
      completed: true,
      buyerId: user?.account,
    })

    if (isLazyMint) {
      if (lazyMint?.supply > 1) {
        // await object2.save().then((object) => {
        //   object2.set('supply', object2.supply - 1);
        //   return object2.save();
        // });
      } else {
        lazyMint && await updateLazyMint({ _id: lazyMint?._id, sold: true })
      }
    }
    setPurchaseStatus(2);
    const request = { account: user?.account, chainId, counts: 1 }
    dispatch(onSaveRewards(request, () => { }))
    setIsFullLoading(false);
  }

  return (
    <div>
      {isFullLoading && <Loading />}

      <div className='offer-btn' onClick={onBuyOrderValidation}>
        <span aria-hidden='true' className='icon_tag_alt fs-20' style={{ marginRight: 12 }} />
        Buy {createdOrder?.saleCounts}
      </div>

      {
        wertConfig &&
        <LayoutModal isOpen={wertConfig ? true : false} onClose={() => setWertConfig(null)} title=''>
          <div className='w-100 d-center'>
            <WertModule
              options={wertConfig}
              style={{ height: 600 }}
            />
          </div>
        </LayoutModal>
      }

      {isModalPriceLacks &&
        <ModalPriceLacks price={finalPrice} onClose={() => setIsModalPriceLacks(false)} />
      }

      <ModalPurchaseProcessing
        {...{ rate, image, isVideo, status: purchaseStatus, name }}
        onList={() => {
          setPurchaseStatus(0)
          setIsCongrat(false)
          handleRoute(router, '/mynfts')
        }}
        onClose={() => {
          setPurchaseStatus(0)
          setIsCongrat(false)
        }}
      />

      <ModalUnreviewedCollection
        {...{ amount }}
        isShow={isReviewCollectionModal}
        collection={category?.label}
        creator={creatorObject?.username || me?.username}
        createdAt={myNFT?.synced_at || myNFT?.last_token_uri_sync}
        onAccept={() => {
          setIsReviewCollectionModal(false);
          setIsPayModal(true);
        }}
        onClose={() => setIsReviewCollectionModal(false)}
      />

      <LayoutModal
        isOpen={isPayModal}
        title={'Choose payment type'}
        onClose={() => setIsPayModal(false)}
      >
        <div className='w-100' style={{ justifyContent: 'space-around', display: 'flex' }}>
          <div
            className='offer-btn bg-primary color-white'
            onClick={() => {
              setIsPayModal(false);
              onBuyOrder(false);
            }}
          >
            Pay with ETH
          </div>

          <div
            className='offer-btn bg-primary color-white'
            onClick={() => {
              setIsPayModal(false);
              onBuyOrder(true);
            }}
          >
            Pay with Credit Card
          </div>
        </div>
      </LayoutModal>
    </div>
  );
}

export default ItemBuy;
