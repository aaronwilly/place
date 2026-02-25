import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alchemy, Network } from 'alchemy-sdk';
import _ from 'underscore';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import CustomPopover from '../custom/CustomPopover';
import { useWeb3Auth } from '../../services/web3auth';
import { handleRoute } from '../../common/function';
import { GetLazyMint } from '../../common/api/noAuthApi';
import UtilService from '../../sip/utilService';
import { ALCHEMY_KEY, DEMO_DEFAULT_AVATAR, MAIN_MINT1155_ADDRESS, MAIN_MINT721_ADDRESS } from '../../keys';

const NFTContent = styled.div`
  width: 80px;
  border-radius: 8px;
  border: 2px solid ${props => props.active ? 'green' : 'red'};
  margin-bottom: 6px;
  margin-right: 12px;
  font-size: 12px;
  overflow: hidden;
  position: relative;

  img {
    width: 70px;
    height: 70px;
    margin: 4px;
    border-radius: 8px;
  }
`

const All = styled.div`
  background: #0d3562;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 11px;
  color: #fff;
  position: absolute;
  right: 2px;
  top: 2px;
`

const NFTCommunity = ({ content, editable, onEdit, onRemove }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, login } = useWeb3Auth()
  const [gatedContents, setGatedContents] = useState([])
  const [isValidImg, setIsValidImg] = useState([])

  const { nfts: nfts721 } = useSelector(state => state.nfts)
  const myNFTs = nfts721?.filter(item => item.owner_of?.account?.toLowerCase() === user?.account)

  console.log('nfts721: ', nfts721)

  const alchemy = new Alchemy({
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  });

  useEffect(() => {
    const onGetActivity = async () => {

      const list = await Promise.all(content?.map(async (item) => {
        if (!item?.nfts) return item
        const nftContents = await Promise.all(item?.nfts?.map(async (x) => {

          const isMetasalt = UtilService.checkMetasalt(x.token_address);

          let nft
          if (isMetasalt) {
            const nft = await GetLazyMint({ token_id: x.token_id });
            const metaData = nft?.metadata ? JSON.parse(nft?.metadata) : nft?.metadata
            const image = UtilService.ConvertImg(metaData?.image);
            const isVideo = metaData?.isVideo
            return nft ? { ...x, image, name: metaData.name, isMetasalt, isVideo } : x
          } else {
            nft = await alchemy.nft.getNftMetadata(x.token_address, x.isAll ? '0001' : x.token_id)
            const image = UtilService.ConvertImg(nft?.rawMetadata?.image);
            const isVideo = nft?.rawMetadata?.isVideo
            return nft ? { ...x, image, name: nft.title, isMetasalt, isVideo } : x
          }
        }))
        return { ...item, nfts: nftContents }
      }))

      setGatedContents(list);
    }

    if (content?.length > 0 ) {
      onGetActivity().then()
    }
  }, [content, nfts721])

  const onGoLink = async (contentItem) => {
    if (!isAuthenticated) {
      await login()
      return false;
    }

    const { type, link, nfts } = contentItem;
    const isMyVideo = type.value === 'video';
    const isMyDiscord = type.value === 'Discord';
    const isMyMusic = type.value === 'Music';
    const extLink = isMyVideo ? `/videos/${link}` : isMyDiscord ? `/discourse/${link}` : isMyMusic ? `/musics/${link}` : link;

    const globalBalances = await alchemy.nft.getNftsForOwner(user?.account);

    const possessNFTIds = globalBalances?.ownedNfts?.map(item => item.contract.address + '-' + item.tokenId)

    if (myNFTs.length + globalBalances?.ownedNfts?.length > 0) {

      const andNFTs = nfts?.filter(item => !item.or)
      const orNFTs = nfts?.filter(item => item.or)

      const gatedNFTAndIds = andNFTs?.map(item => item.token_address + '-' + item.token_id)
      const gatedNFTOrIds = orNFTs?.map(item => item.token_address + '-' + item.token_id)
      const metasaltIds = myNFTs.map(item => item.token_id)

      const isExistMetasaltAndNFTs = andNFTs?.find(x => x.token_address === MAIN_MINT721_ADDRESS || x.token_address === MAIN_MINT1155_ADDRESS)

      let orExist = false;
      let andExistGlobal = false;
      let andExistMetasalt = false;

      const matchAndGlobalNFTs = _.intersection(possessNFTIds, gatedNFTAndIds)

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
        handleRoute(router, extLink)
      } else {
        dispatch(addNotification('You don\'t have the NFTs needed to access this content.', 'error'))
      }

    } else {
      if (!window.ethereum) {
        dispatch(addNotification('🦊 You must install Metamask in your browser.', 'error', 'metamask'))
        return false;
      }
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

  return (
    <div className='offer-body mt-2'>
      <div className='w-100'>
        <table>
          <thead>
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Type</th>
              <th className="text-center">NFTs</th>
              {!editable && <th className="text-center">Lock</th>}
              {editable && <th className="text-center">Edit</th>}
              {editable && <th className="text-center">Remove</th>}
            </tr>
          </thead>

          <tbody className="position-relative">
          {content?.length > 0 && gatedContents.length > 0 && gatedContents?.map((item, index) => {
            const { type, link, title } = item;
            const isMyVideo = type.value === 'video';
            const isMyDiscord = type.value === 'Discord';
            const isMyMusic = type.value === 'Music';
            const onHrefLink = isAuthenticated ? (isMyVideo ? `/videos/${link}` : isMyDiscord ? `/discourse/${link}` : isMyMusic ? `/musics/${link}` : link) : '/login'
            
            return (
              <tr key={index}>
                <td className="text-center">{title}</td>
                <td className="text-center">{type.label}</td>
                <td style={{ flex: 1 }}>
                  <div className="d-flex flex-row flex-wrap position-relative">
                    {item?.nfts?.map((x, ll) =>
                      <CustomPopover
                        key={ll}
                        content={!x?.or ? 'Mandatory NFT to access the content' : 'Need at least one NFT to access the content'}
                        placement='bottom'
                      >
                        <NFTContent active={x?.or}>
                          {isValidImg.includes('g' + ll) &&
                            <picture>
                              <img src={UtilService.ConvertImg(x?.image) || DEMO_DEFAULT_AVATAR} alt='nft image' />
                            </picture>
                          }
                          {!isValidImg.includes('g' + ll) &&
                            <video
                              src={x?.image}
                              preload="auto"
                              autoPlay={true}
                              style={{ height: 70 }}
                              onError={e => onErrorVideo(e, 'g' + ll)}
                            />
                          }
                          {x?.isAll && <All>All</All>}
                          <div className="text-center overflow-hidden" style={{ maxHeight: 21 }}>{x?.name}</div>
                        </NFTContent>
                      </CustomPopover>
                    )}
                  </div>
                </td>

                {!editable &&
                  <td className="text-center">
                    &nbsp;&nbsp;
                    {item?.nfts?.length > 0 ?
                      <div className='color-sky text-decoration-underline' onClick={() => onGoLink(item)}>
                        <span aria-hidden="true" className="icon_lock_alt cursor-pointer" />
                      </div>
                      :
                      <div className='color-sky text-decoration-underline' onClick={() => handleRoute(router, onHrefLink)}>
                        <span aria-hidden="true" className="icon_check_alt2 cursor-pointer" />
                      </div>
                    }
                  </td>
                }
                {editable &&
                  <td className="text-center">
                    <span aria-hidden="true" className="icon_pencil cursor-pointer" onClick={() => onEdit(item)} />
                  </td>
                }
                {editable &&
                  <td className="text-center">
                    <span aria-hidden="true" className="icon_close cursor-pointer" onClick={() => onRemove(index)} />
                  </td>
                }
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NFTCommunity;
