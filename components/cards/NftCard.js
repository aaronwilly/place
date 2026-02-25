import { useRouter } from 'next/router';
import React, { memo, useState } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import OutsideClickHandler from 'react-outside-click-handler';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import QRCode from 'react-qr-code';
import bigInt from 'big-integer';
import clsx from 'clsx';
import CustomPopover from '../custom/CustomPopover';
import useWindowSize from '../../hooks/useWindowSize';
import UtilService from '../../sip/utilService';
import { useWeb3Auth } from '../../services/web3auth';

const MetasaltLogo = styled.div`
  // width: 30px;
  // height: 30px;
  // background: #333;
  // border-radius: 15px;
  // box-shadow: -2px 0 4px 0 rgba(0, 0, 0, 0.75);
  position: absolute;
  right: 3px;
  bottom: 3px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 18px;
  }
`

const VideoPlay = styled.div`
  width: 30px;
  height: 30px;
  background: #333;
  border-radius: 15px;
  box-shadow: -2px 0 4px 0 rgba(0, 0, 0, 0.75);
  position: absolute;
  left: 3px;
  bottom: 3px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 17px;
    height: 17px;
  }
`

const NftCard = ({ nft, disableLink, big, token_id: tId, favHidden, supply }) => {

  const router = useRouter()
  const { chain } = useWeb3Auth()
  const { width } = useWindowSize()
  const [isShare, setIsShare] = useState(false)
  const [isQrCode, setIsQrCode] = useState(false)
  const [isShowVideo, setShowVideo] = useState(false)
  const chainId = UtilService.getChain4(chain);

  const maxWidth = big ? 230 : 130
  const isDesktop = width > 600
  const token_address = nft?.token_address
  const token_id = UtilService.checkHexa(tId) ? tId : '0x' + bigInt(tId).toString(16)

  const ipfsImage = nft.thumbnail + '-/preview/300x600/'
  const token_net = nft?.net || UtilService.checkNet(token_address)
  const shareLink = `https://klik.cool/nftmarketplace/${token_net}/${token_address}/${token_id}`
  const isMetasalt = UtilService.checkMetasalt(token_address)

  const onGoLink = () => {
    token_id ?
      router.push(`/nftmarketplace/${token_net}/${token_address}/${UtilService.tokenIDHexConvert(token_id)}`, undefined, { shallow: true })
      :
      {}
  }

  return (
    <div className={clsx(big ? 'nft-card-big' : 'nft-card')} style={{ height: 'auto', background: '#191c1f', position: 'relative' }}>

      <div className={`position-relative ${clsx(big ? 'nft-card-header-big' : 'nft-card-header')}`}>
        {ipfsImage && !isShowVideo && <LazyLoadImage onClick={onGoLink} src={ipfsImage} effect="blur" />}
        {/* {ipfsImage && isShowVideo && <video controls src={nft.preview_image_url} className='max-w-100 h-100' onClick={onGoLink} />} */}
        {!ipfsImage && <div className='pre-nft'>NFT</div>}
        {isMetasalt && <MetasaltLogo><picture><img src='/img/fav.png' alt='logo' /></picture></MetasaltLogo>}
        {/* {nft?.isVideo && !isShowVideo && <VideoPlay onClick={() => setShowVideo(true)}><picture><img src='/img/play-icon.png' alt='play' /></picture></VideoPlay>} */}
      </div>

      {supply > 0 && <div className='supply-btn'>{supply}</div>}

      {nft?.ordering && <div className='order-btn'><div className='transform-order-text'>Buy</div></div>}

      {!isDesktop &&
        <div style={{ background: '#191c1f', padding: '2px 7px', color: '#bbb' }}>
          <div className='fs-13 d-row justify-content-between'>
            <div className='text-nowrap overflow-hidden' style={{ maxWidth: 90 }}>{nft.title}</div>
            {nft.price && <div className='text-nowrap overflow-hidden'>
              <picture>
                <img
                  src={nft?.net ? UtilService.CurrencyNetIcon(nft?.net) : UtilService.CurrencyIcon(token_address)}
                  alt='chain'
                  style={{ width: 14, marginRight: 3, marginTop: -2 }}
                />
              </picture>
              <span style={{ fontSize: 9 }}>{nft.price}</span>
            </div>}
          </div>
        </div>
      }

      {isDesktop && <div style={{ background: '#191c1f', padding: 12, color: '#bbb' }}>

        <div className='fs-13 d-row justify-content-between'>
          <div className='text-nowrap overflow-hidden' style={{ maxWidth }}>{nft.title}</div>
          {nft.price && <div>Price</div>}
        </div>

        <div className='fs-13 fw-semibold d-row justify-content-between' style={{ marginTop: -2 }}>
          <div className='overflow-hidden' style={{ maxWidth: 110, height: 20 }}>
            {nft.description && (UtilService.convertEmoji(nft.description))}
          </div>
          {nft.price &&
            <div className='text-nowrap overflow-hidden'>
              <picture>
                <img
                  src={nft?.net ? UtilService.CurrencyNetIcon(nft?.net) : UtilService.CurrencyIcon(token_address)}
                  alt='chain'
                  style={{ width: 14, marginTop: -2, marginRight: 3 }}
                />
              </picture>
              {nft.price}
            </div>
          }
        </div>

        {!favHidden &&
          <div className='fs-13 d-row align-items-center justify-content-between' style={{ marginTop: 5 }}>
            <div className='mt-2' />
            <div className='position-absolute' style={{ right: 6, bottom: 42 }}>
              {nft?.lazyMint && <i className="wm icon_lightbulb_alt" title='Lazy Minted' />}
              {nft?.onsale &&
                <picture>
                  <img src={'../img/sale.png'} alt='lazy' style={{ width: 20, marginLeft: 3, marginTop: -2 }} title='History' />
                </picture>
              }
              {nft?.verified &&
                <picture>
                  <img src={'../img/approval.png'} alt='lazy' style={{ width: 16, marginLeft: 3, marginTop: -2 }} title='Authenticated' />
                </picture>
              }
            </div>
          </div>
        }

        {!disableLink && <div className={`divider mt-2 ${(token_net === 'polygon' || token_net === 'mumbai') && 'bg-theme'}`}/>}
        
        {!disableLink &&
          <div className='w-100 mt-2 position-relative d-flex flex-row justify-content-between'>
            <CustomPopover content="Buy">
              <div className='d-flex align-items-center justify-content-center cursor-pointer' onClick={() => router.push(`/nftmarketplace/${token_net}/${token_address}/${token_id}`, undefined, { shallow: true })}>
                <picture><img src={'../img/icons/ic_buy.png'} alt='buy' /></picture>
              </div>
            </CustomPopover>

            {!nft?.verified &&
              <CustomPopover content="Authentication">
                <div className='d-flex align-items-center justify-content-center cursor-pointer' onClick={() => router.push(`/authentication?token=${token_id}&net=${token_net}`, undefined, { shallow: true })}>
                  <picture><img src={'../img/icons/ic_verify1.png'} alt='auth' /></picture>
                </div>
              </CustomPopover>
            }

            {nft?.categoryId &&
              <CustomPopover content="Collection">
                <div className='d-flex align-items-center justify-content-center cursor-pointer' onClick={() => router.push(`/subCollection/${nft?.categoryId}`, undefined, { shallow: true })}>
                  <picture><img src={'../img/icons/ic_col1.png'} alt='col' /></picture>
                </div>
              </CustomPopover>
            }

            <CustomPopover content="Explorer">
              <a className='d-flex align-items-center justify-content-center cursor-pointer' href={UtilService.getScanAddress(chainId)} target='_blank' rel="noreferrer">
                <picture><img src={'../img/icons/ic_chart.png'} alt='explorer' /></picture>
              </a>
            </CustomPopover>

            <CustomPopover content="Share">
              <div className='d-flex align-items-center justify-content-center cursor-pointer text-decoration-none' onClick={() => setIsShare(true)}>
                <picture><img src={'../img/icons/ic_share.png'} alt='explorer' /></picture>
              </div>
            </CustomPopover>

            <CustomPopover content="QrCode">
              <div className='d-flex align-items-center justify-content-center cursor-pointer none-underline' onClick={() => setIsQrCode(true)}>
                <picture><img src={'../img/icons/ic_qr.png'} alt='explorer' /></picture>
              </div>
            </CustomPopover>

            {isQrCode &&
              <OutsideClickHandler onOutsideClick={() => setIsQrCode(false)}>
                <div className="share-overlay d-flex flex-column">
                  <div className='p-3 bg-white'>
                    <QRCode value={shareLink} size={150} />
                  </div>
                </div>
              </OutsideClickHandler>
            }

            {isShare &&
              <OutsideClickHandler onOutsideClick={() => setIsShare(false)}>
                <div className="share-overlay d-flex flex-column">
                  <div><WhatsappShareButton url={shareLink}><WhatsappIcon size={25} round/> Whatsapp share</WhatsappShareButton></div>
                  <div className="mt-2"><TwitterShareButton url={shareLink}><TwitterIcon size={25} round/> Twitter share</TwitterShareButton></div>
                  <div className="mt-2"><FacebookShareButton url={shareLink}><FacebookIcon size={25} round/> Facebook share</FacebookShareButton></div>
                  <div className="mt-2"><TelegramShareButton url={shareLink}><TelegramIcon size={25} round/> Telegram share</TelegramShareButton></div>
                  <div className="mt-2"><LinkedinShareButton url={shareLink}><LinkedinIcon size={25} round/> Linkedin share</LinkedinShareButton></div>
                  <div className="mt-2"><EmailShareButton url={shareLink}><EmailIcon size={25} round/> Email share</EmailShareButton></div>
                </div>
              </OutsideClickHandler>
            }
          </div>
        }

        <ReactTooltip />
      </div>
      }
    </div>
  );
};

export default memo(NftCard);        
