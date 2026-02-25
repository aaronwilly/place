import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { Loading } from '../../components/loading';
import ModalEditPrice from '../../components/modals/modalEditPrice';
import ModalEditCounts from '../../components/modals/modalEditCounts';
import { useWeb3Auth } from '../../services/web3auth';
import { createOrderData } from '../../common/api/authApi';
import { handleRoute } from '../../common/function';
import { Asset, Enc, EncLazyMint1155Data, EncLazyMint721Data, ERC1155, ERC1155_LAZY, ERC721, ERC721_LAZY, ETH, Order, SignOrder, ZERO } from '../../sip/LazymintConfig';
import UtilService from '../../sip/utilService';

const mint721ABI = require('../../constants/abis/mint721ABI.json');
const mint1155ABI = require('../../constants/abis/mint1155ABI.json');

const ItemSell = ({
  myNFT,
  changedPrice,
  setChangedPrice,
  setSwitchNetworkModal,
  lazyMintByTokenId: lazyMint,
  orderDataByTokenId,
}) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { token_id: ercTokenId, token_address, net } = router.query;
  const { user, web3Auth, chain, balance } = useWeb3Auth();
  const account = user?.account;

  const [saleCounts, setSaleCounts] = useState('1');
  const [isEditableCountsModal, setIsEditableCountsModal] = useState(false);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isEditablePriceModal, setIsEditablePriceModal] = useState(false);
  const createdOrder = useMemo(() => orderDataByTokenId.find(item => item?.completed === false), [orderDataByTokenId]);
  const mPrice = useMemo(() => orderDataByTokenId.length && orderDataByTokenId[0]?.price?.toString(), [orderDataByTokenId])

  const { royalties: royal } = (myNFT?.metadata && JSON.parse(myNFT?.metadata)) || '-'
  const priceChain = UtilService.getChain4(net);
  const royalties = royal || '0'; // default royaltee is 0

  const price = myNFT?.metadata && JSON.parse(myNFT?.metadata)?.price?.toString();
  let isLazyMint = myNFT?.lazyMint;

  const finalPrice = createdOrder ? (createdOrder.price || price) : (changedPrice || mPrice || price);
  const type = myNFT?.contract_type || myNFT?.type || 'ERC721';
  const supply = myNFT?.supply || 1;
  const creator = lazyMint?.sold === true ? lazyMint?.creator : (myNFT?.create_of?.account || myNFT?.create_of || myNFT?.owner_of);

  const onMakeOrder = async () => {

    const chainId = UtilService.getChain4(chain);

    if (priceChain !== chainId) {
      setSwitchNetworkModal(true);
      return false;
    }

    if (type === 'ERC1155') {
      setIsEditableCountsModal(true);
    }

    setIsFullLoading(true);

    const web3authProvider = await web3Auth.connect();
    const web3 = new Web3(web3authProvider);
    const MINT_PRICE = web3.utils.toWei((finalPrice * Number(saleCounts) + '') || '0.001');

    try {
      const contract = new web3.eth.Contract(type === 'ERC721' ? mint721ABI.abi : mint1155ABI.abi, token_address, account);

      await contract.methods.setApprovalForAll(UtilService.getMarketAddress(chainId), true)
        .send({ from: account })
        .on('transactionHash', () => {})
        .then(() => {})

      setIsFullLoading(false);
    } catch (e) {
      dispatch(addNotification(e.message, 'error'))
      setIsFullLoading(false);
      return false;
    }

    let left;

    if (type === 'ERC721') {
      if (isLazyMint) {
        const encodedMintData = await EncLazyMint721Data(web3, token_address, ercTokenId, lazyMint?.tokenURI, creator?.account || creator, royalties, lazyMint?.signature);
        left = Order(account, Asset(ERC721_LAZY, encodedMintData, 1), ZERO, Asset(ETH, '0x', MINT_PRICE), '0x');
      } else {
        left = Order(account, Asset(ERC721, Enc(web3, token_address, ercTokenId), 1), ZERO, Asset(ETH, '0x', MINT_PRICE), '0x');
      }
    } else {
      if (isLazyMint) {
        const encodedMintData = await EncLazyMint1155Data(web3, token_address, ercTokenId, lazyMint?.tokenURI, supply, creator?.account || creator, royalties, lazyMint?.signature);
        left = Order(account, Asset(ERC1155_LAZY, encodedMintData, Number(saleCounts)), ZERO, Asset(ETH, '0x', MINT_PRICE), '0x');
      } else {
        left = Order(account, Asset(ERC1155, Enc(web3, token_address, ercTokenId), Number(saleCounts)), ZERO, Asset(ETH, '0x', MINT_PRICE), '0x');
      }
    }

    const signatureLeft = await SignOrder(web3, left, account, UtilService.getMarketAddress(chainId));

    const request = {
      token_id: ercTokenId,
      data: left.data,
      price: changedPrice || mPrice || price,
      signatureLeft,
      saleCounts,
      makeAsset_value: left.makeAsset.value,
      makeAsset_assetType_assetClass: left.makeAsset.assetType.assetClass,
      makeAsset_assetType_data: left.makeAsset.assetType.data,
      takeAsset_value: Number(left.takeAsset.value),
      takeAsset_assetType_assetClass: left.takeAsset.assetType.assetClass,
      takeAsset_assetType_data: left.takeAsset.assetType.data,
      completed: false,
      makerId: left.maker,
      taker: left.taker,
    }

    setIsFullLoading(true);

    try {
      await createOrderData(request)
      setIsFullLoading(false);
      handleRoute(router, '/mynfts')
    } catch (e) {
      dispatch(addNotification('Transaction failed!', 'error'))
      setIsFullLoading(false);
    }
  }

  const onSell = () => {
    
    console.log('balance: ', balance)
    console.log('palance: ', Number(balance))
    if(Number(balance) === 0){
      dispatch(addNotification('Sorry, you don\'t have any money to sell this NFT', 'error'))
      return false;
    }

    if(type === 'ERC721'){
      setIsEditablePriceModal(true)
    }else{
      setIsEditableCountsModal(true)
    }
  }

  return (
    <div>
      {isFullLoading && <Loading />}

      {(!createdOrder || createdOrder?.maker === account) &&
        // ?
        <div className="offer-btn buy-btn" onClick={onSell}>
          <span aria-hidden="true" className="icon_wallet fs-20" style={{ marginRight: 12 }} />
          Sell
        </div>
        // :
        // <div className='text-warning'>
        //   It is not allowed to create new sale, because there is already existed sale by
        //   <span className='text-primary cursor' onClick={() => router.push(`/sales/${createdOrder?.maker}`)}> &nbsp;
        //     {getUserNameFromAddress(createdOrder?.maker)}
        //   </span>
        // </div>
      }

      {isEditableCountsModal &&
        <ModalEditCounts
          onClose={() => setIsEditableCountsModal(false)}
          saleCounts={saleCounts}
          setSaleCounts={setSaleCounts}
          maxValue={myNFT?.amount}
          onSuccess={() => {
            setIsEditableCountsModal(false)
            setIsEditablePriceModal(true);
          }}
        />
      }

      {isEditablePriceModal &&
        <ModalEditPrice
          onClose={() => {
            setChangedPrice(mPrice || price)
            setIsEditablePriceModal(false)
          }}
          setChangedPrice={setChangedPrice}
          changedPrice={changedPrice || mPrice || price}
          onSuccess={() => {
            setIsEditablePriceModal(false)
            onMakeOrder().then()
          }}
        />}
    </div>
  );
}

export default ItemSell;
