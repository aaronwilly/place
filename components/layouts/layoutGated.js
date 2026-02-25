import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alchemy, Network } from 'alchemy-sdk';
import _ from 'underscore';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from './layoutModal';
import CustomPopover from '../custom/CustomPopover';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { ALCHEMY_KEY, DEMO_DEFAULT_AVATAR, MAIN_MINT1155_ADDRESS, MAIN_MINT721_ADDRESS } from '../../keys';
import { getLazyMint } from '../../common/api/authApi';

const NFTContent = styled.div`
  width: 80px;
  border: 2px solid ${props => props.active ? 'green' : 'red'};
  border-radius: 8px;
  margin-right: 12px;
  margin-bottom: 6px;
  font-size: 12px;
  overflow: hidden;
  position: relative;

  img {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    margin: 4px;
  }
`

const All = styled.div`
  background: #0d3562;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 11px;
  color: #fff;
  position: absolute;
  top: 2px;
  right: 2px;
`

const LayoutGated = ({ data, title }) => {

  const router = useRouter();
  const [isShowGatedModal, setIsShowGatedModal] = useState(true);
  const { user, isAuthenticated, login } = useWeb3Auth();
  const { nfts: nfts721 } = useSelector(state => state.nfts);
  const [gatedContents, setGatedContents] = useState([]);
  const [isValidImg, setIsValidImg] = useState([]);
  const [isCheck, setIsCheck] = useState(false);
  // const [gatingNFTs, setGatingNFTs] = useState([]); // multi: content.map(x => x.token_id) DO NOT REMOVE
  const dispatch = useDispatch();
  const account = user?.account;
  const myNFTs = nfts721?.filter(item => item.owner_of?.account?.toLowerCase() === account)
  const content = data ? JSON.parse(data) : [];
  const gatingNFTs = nfts721;

  const alchemy = new Alchemy({
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  });

  useEffect(() => {
    onGetActivity().then()
  }, [gatingNFTs])

  const onGetActivity = async () => {

    const nftContents = await Promise.all(content?.map(async (x) => {

      const isMetasalt = UtilService.checkMetasalt(x.token_address)

      let nft = null;
      if (isMetasalt) {
        const nft = await getLazyMint({ token_id: x.token_id });
        // nft = await gatingNFTs?.find(p => p.token_address?.toLowerCase() === x.token_address?.toLowerCase() && p.token_id === x.token_id)
        const metaData = nft?.metadata ? JSON.parse(nft.metadata) : null;
        const image = UtilService.ConvertImg(metaData?.image);
        const isVideo = metaData?.isVideo
        return nft ? { ...x, image, name: metaData.name, isMetasalt, isVideo } : x
      } else {
        nft = await alchemy.nft.getNftMetadata(x.token_address, x.isAll ? '0001' : x.token_id)
        const image = UtilService.ConvertImg(nft.rawMetadata.image);
        const isVideo = nft.rawMetadata.isVideo
        return nft ?{ ...x, image, name: nft.title, isMetasalt, isVideo } : x
      }

    }))
    setGatedContents([...nftContents]);
    setIsCheck(true);
  }

  const onRevealContent = async () => {

    if (!isAuthenticated) {
      login()
      return false;
    }

    if (content?.length === 0) {
      setIsShowGatedModal(false);
      return false;
    }

    const globalBalances = await alchemy.nft.getNftsForOwner(account);

    const possessNFTIds = globalBalances?.ownedNfts?.map(item => item.contract.address + '-' + item.tokenId)

    if (myNFTs.length + globalBalances?.ownedNfts?.length > 0) {

      const andNFTs = content?.filter(item => !item.or)
      const orNFTs = content?.filter(item => item.or)

      const gatedNFTAndIds = andNFTs?.map(item => item.token_address + '-' + item.token_id)
      const gatedNFTOrIds = orNFTs?.map(item => item.token_address + '-' + item.token_id)
      const metasaltIds = myNFTs.map(item => item.token_id)

      const isExistMetasaltAndNFTs = andNFTs?.find(x => x.token_address === MAIN_MINT721_ADDRESS || x.token_address === MAIN_MINT1155_ADDRESS)

      const isNoGlobalNFTS = content.find((pp) => !UtilService.checkMetasalt(pp.token_address))

      let orExist = false;
      let andExistGlobal = false;
      let andExistMetasalt = false;

      const matchAndGlobalNFTs = _.intersection(possessNFTIds, gatedNFTAndIds)

      if (!isNoGlobalNFTS) {
        andExistGlobal = true;
      }
      if (matchAndGlobalNFTs?.length === gatedNFTAndIds?.length) {
        andExistGlobal = true;
      }

      possessNFTIds?.map((item) => {

        if (gatedNFTOrIds.includes(item)) {
          orExist = true;
        }

        const dupliOr = _.intersection(metasaltIds, orNFTs.map(x => x.token_id))
        const dupliAnd = _.intersection(metasaltIds, andNFTs.map(x => x.token_id))

        if (dupliOr.length > 0) {
          orExist = true;
        }

        if (dupliAnd.length > 0 && dupliAnd.length === orNFTs.length) {
          andExistMetasalt = true;
        }

        if (!isExistMetasaltAndNFTs) {
          andExistMetasalt = true;
        }
      })

      if (orExist && andExistMetasalt && andExistGlobal) {
        setIsShowGatedModal(false)
      } else {
        dispatch(addNotification('Get NFT to access content', 'error'))
      }

    } else {
      if (!user) {
        dispatch(addNotification('🦊 You are not logged in the website!', 'error'))
        return false;
      }
      dispatch(addNotification('You don\'t have any NFT in your wallet, please purchase at least one NFT to reveal the content', 'error'))
    }
  }

  const onErrorVideo = (e, pp) => {
    if (e.type === 'error') {
      setIsValidImg(isValidImg.concat(pp));
    } else {
      return null
    }
  }

  const onClose = () => {

  }

  if(isCheck && gatedContents.length === 0 ) return null

  console.log('gatedContents: ', gatedContents)
  return (
    <div>
      <LayoutModal isOpen={isShowGatedModal} title={title} onClose={onClose} hiddenClose>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div className='mt-2 offer-body'>
            <div className='w-100'>
              <div className="d-flex flex-row flex-wrap position-relative">
                {gatedContents?.map((x, ll) =>
                  <CustomPopover
                    key={ll}
                    content={!x.or ? 'Mandatory NFT to access the content' : 'Need at least one NFT to access the content'}
                    placement='bottom'
                  >
                    <NFTContent active={x.or}>
                      {isValidImg.includes('g' + ll) &&
                        <picture>
                          <img src={UtilService.ConvertImg(x.image) || DEMO_DEFAULT_AVATAR} alt='nft image' />
                        </picture>
                      }
                      {!isValidImg.includes('g' + ll) &&
                        <video
                          src={x.image}
                          preload="auto"
                          autoPlay={true}
                          onError={e => onErrorVideo(e, 'g' + ll)}
                          style={{ height: 70 }}
                        />
                      }
                      {x.isAll && <All>All</All>}
                      <div className="text-center overflow-hidden" style={{ maxHeight: 21 }}>{x.name}</div>
                    </NFTContent>
                  </CustomPopover>
                )}

                {gatedContents.length === 0 && <div>No Token Gated</div>}
              </div>
            </div>
          </div>

          <div className="mt-3 row align-items-center">
            <div className="width-100 offer-btn" style={{ marginRight: 20 }} onClick={() => router.back()}>
              Cancel
            </div>

            <div className='width-200 offer-btn buy-btn cursor-pointer' onClick={onRevealContent}>
              Unlock
            </div>
          </div>
        </div>
      </LayoutModal>
    </div>
  );
};

export default LayoutGated;
