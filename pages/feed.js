import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
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
  WhatsappShareButton
} from 'react-share';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import useWindowSize from '../hooks/useWindowSize';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { onLikes } from '../common/web3Api';
import { useWeb3Auth } from '../services/web3auth';
import { createComment } from '../common/api/authApi';
import { GetAllLikes, GetAllNFTs, GetComments, GetOrderData } from '../common/api/noAuthApi';
import { handleRoute } from '../common/function';
import UtilService from '../sip/utilService';
import { DEMO_AVATAR, GOERLI_MINT721_ADDRESS, MAIN_MINT721_ADDRESS, PROD } from '../keys';

const CreatedAt = styled.div`
  font-size: 13px;
  color: #777;

  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`
const Description = styled.div`
  margin-top: 10px;
  font-size: 19px;

  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`
const Username = styled.div`
  margin-top: 10px;
  font-size: 25px;

  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const FeedPage = ({ orderData }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, login } = useWeb3Auth()
  const { width } = useWindowSize()
  const [commentText, setCommentText] = useState('')
  const [trigger, setTrigger] = useState(1);
  const [shareId, setShareId] = useState(-1);
  const [commentId, setCommentId] = useState(-1);
  const [nfts, setNFTs] = useState([]);
  const stepCount = 10
  const [loadCount, setLoadCount] = useState(stepCount);
  const [myNFTLikes, setMyNFTLikes] = useState([])
  const [comments, setComments] = useState([])

  const allNFT = nfts || [];

  useEffect(() => {
    const loadALlNFTs = async () => {
      const response = await GetAllNFTs()
      response && setNFTs(response)
    }
    
    loadALlNFTs().then()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      const response1 = await GetAllLikes({ type: 'nft', likerId: user?.account })
      response1 && setMyNFTLikes(response1)
      const response2 = await GetComments({})
      response2 && setComments(response2)
    }

    loadData().then()
  }, [user, trigger])

  const renderAllNFT = allNFT.map((item) => {

    const { image, price, description, chain, isVideo, name } = JSON.parse(item.metadata);
    const mOrderData = orderData.length > 0 && orderData.find(datum => datum?.token_id === item.token_id);

    return {
      id: item.token_id,
      username: name || '-',
      user_avatar: UtilService.ConvertImg(item?.owner_of?.avatar) || DEMO_AVATAR,
      createdAt: moment(item.synced_at).format('L, LT'),
      poster_url: UtilService.ConvertImg(image),
      description,
      price: mOrderData?.price || price,
      address: item?.owner_of?.account,
      isVideo,
      chain,
    };
  })

  const onLikeNFT = async (item) => {
    const likeData = { lazyMintId: item?.id, type: 'nft', likerId: user?.account, router }
    await dispatch(onLikes(likeData, () => setTrigger(trigger + 1)))
  }

  const onSend = async (item) => {
    if (!isAuthenticated) {
      await login()
      return false
    }
    await createComment({
      nftId: item?.id,
      type: 'nft',
      comment: commentText,
      commenterId: user?.account,
    })
    setCommentText('');
    setTrigger(trigger + 1);
  }

  return (
    <LayoutPage>
      <LayoutScreen
        title='Feed'
        description="Get to minting NFTs. Otherwise, scroll to view and buy your friend's NFTs."
      >
        <div className='centerPane'>
          <div className='d-flex flex-row social-pane'>
            {nfts?.length > 0 &&
              <div>
                <div className="social-add">
                  <Link href='/mynfts' prefetch={false} className='d-flex flex-row align-items-center'>
                    <div className="d-flex flex-row">
                      <div className="profile-avatar-s" style={{ width: 56 }}>
                        <picture>
                          <img src={UtilService.ConvertImg(user?.avatar || DEMO_AVATAR)} alt="me" />
                        </picture>
                      </div>
                      <p className="mt-3 fs-20-responsive center-div">
                        Get to minting NFTs. Otherwise, scroll to view and buy your friend's NFTs.
                      </p>
                    </div>
                  </Link>
                  <div className="m-10 center-div cursor-pointer" onClick={() => handleRoute(router, '/makeNFTs')}>
                    <div className="color-sky">CREATE YOUR NFT</div>
                  </div>
                </div>

                {renderAllNFT.slice(0, loadCount).map((item, index) => (
                  <PostItem
                    key={index}
                    item={item}
                    onLike={() => onLikeNFT(item)}
                    onShare={() => setShareId(item.id)}
                    shareId={shareId}
                    onShareClose={() => setShareId(-1)}
                    photoUrl={UtilService.ConvertImg(user?.avatar) || DEMO_AVATAR}
                    onSend={() => onSend(item)}
                    commentText={commentText}
                    onCommentAvailable={() => {
                      setCommentText('');
                      setCommentId(commentId === item?.id ? -1 : item?.id)
                    }}
                    commentId={commentId}
                    onChangeComment={e => setCommentText(e.target.value)}
                    myLikes={myNFTLikes}
                    comments={comments}
                    width={width}
                    chain={item.chain}
                  />
                ))}

                {renderAllNFT.length > loadCount &&
                  <div className='p-3 text-center'>
                    <button className='btn btn-outline-info' onClick={() => setLoadCount(loadCount + stepCount)}>
                      Load More
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
};

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response = await GetOrderData({})

  return {
    props: {
      orderData: response || [],
    }
  }
}

export default FeedPage;

const PostItem = ({
  onLike,
  onShare,
  shareId,
  onShareClose,
  photoUrl,
  onSend,
  onCommentAvailable,
  commentText,
  commentId,
  onChangeComment,
  item,
  myLikes = [],
  comments = [],
  width
}) => {

  const router = useRouter();
  const { poster_url, username, createdAt, description, id, price, address, isVideo } = item;
  const token_net = PROD ? 'eth' : 'goerli';
  const token_address = PROD ? MAIN_MINT721_ADDRESS : GOERLI_MINT721_ADDRESS;
  const shareLink = `https://klik.cool/nftmarketplace/${token_net}/${token_address}/${id}`;
  const likedByMe = myLikes.find(like => like?.lazyMintId === item?.id)
  const itemComments = comments.filter(comment => comment?.nftId === item?.id)

  return (
    <div className="social-add">
      <div className="d-flex flex-row cursor-pointer" onClick={() => handleRoute(router, `/sales/${address}`)}>
        <div className="ml-10">
          <Username className="fw-semibold">{username}</Username>
          <CreatedAt>{createdAt}</CreatedAt>
        </div>
      </div>

      <div className="mt-10 center-div cursor-pointer" onClick={() => handleRoute(router, `/nftmarketplace/${token_net}/${token_address}/${id}`)}>
        {poster_url && !isVideo && <picture><img src={poster_url} alt='nft' style={{ maxWidth: width > 600 ? 400 : 210 }} /></picture>}
        {poster_url && isVideo && <video controls src={poster_url} style={{ maxHeight: width > 600 ? '60%' : '80%', maxWidth: width > 600 ? '60%' : '80%' }} />}
      </div>

      <Description>{(description && (UtilService.convertEmoji(description)))}</Description>

      <div className="center-div mobile-hidden justify-content-between">
        <p className="fs-20-responsive">
          <picture>
            <img src={UtilService.CurrencyIcon(token_address)} alt="ether" style={{ width: 24, height: 24 }} />
          </picture>
          {price}
        </p>
        <div className="btn-main" onClick={() => handleRoute(router, `/nftmarketplace/${token_net}/${token_address}/${id}`)}>Buy</div>
      </div>

      {itemComments.length > 0 && <div className="text-end">{itemComments.length} comments</div>}

      <div className="mt-10 divider" />

      <div className="d-row mobile-hidden">
        <div className="m-10 center-div cursor-pointer" onClick={onLike}>
          <span
            aria-hidden="true"
            className={!likedByMe ? 'icon_heart_alt' : 'icon_heart'}
            style={{ marginRight: 12, fontSize: 20, color: likedByMe ? '#ff343f' : 'grey' }}
          />
          Like
        </div>
        <div className="m-10 center-div cursor-pointer" onClick={onCommentAvailable}>
          <span aria-hidden="true" className="icon_comment fs-20" style={{ marginRight: 12 }} />
          Comment
        </div>

        <div className="m-10 center-div cursor-pointer position-relative" style={{ zIndex: 1 }}>
          <div onClick={onShare} className="center-div">
            <span aria-hidden="true" className="social_share fs-20" style={{ marginRight: 12 }} />
            <div>Share</div>
          </div>

          {shareId === id &&
            <OutsideClickHandler onOutsideClick={() => onShareClose()}>
              <div className="share-overlay d-flex flex-column">
                <div>
                  <WhatsappShareButton url={shareLink}><WhatsappIcon size={25} round /> Whatsapp share</WhatsappShareButton>
                </div>
                <div className="mt-2">
                  <TwitterShareButton url={shareLink}><TwitterIcon size={25} round /> Twitter share</TwitterShareButton>
                </div>
                <div className="mt-2">
                  <FacebookShareButton url={shareLink}><FacebookIcon size={25} round /> Facebook share</FacebookShareButton>
                </div>
                <div className="mt-2">
                  <TelegramShareButton url={shareLink}><TelegramIcon size={25} round /> Telegram share</TelegramShareButton>
                </div>
                <div className="mt-2">
                  <LinkedinShareButton url={shareLink}><LinkedinIcon size={25} round /> Linkedin share</LinkedinShareButton>
                </div>
                <div className="mt-2">
                  <EmailShareButton url={shareLink}><EmailIcon size={25} round /> Email share</EmailShareButton>
                </div>
              </div>
            </OutsideClickHandler>
          }
        </div>
      </div>

      {commentId === id && <div>
        <div className="social-add position-relative" style={{ marginTop: 1, marginBottom: -10 }}>
          <div className="d-flex flex-row align-items-center">
            <picture>
              <img
                src={UtilService.ConvertImg(photoUrl)}
                alt="photo_url"
                onClick={() => handleRoute(router, '/mynfts')}
                style={{ width: 44, height: 44, borderRadius: 22, marginLeft: -14 }}
              />
            </picture>
            <input
              className="w-100 bg-3 ml-4 fs-18 color-b"
              style={{ borderRadius: 18, border: 'none', padding: 12 }}
              placeholder="Write a public comment..."
              value={commentText}
              onChange={onChangeComment}
            />
            {commentText &&
              <button
                className="btn-main cursor-pointer position-absolute"
                style={{ padding: '6px 10px', right: 25 }}
                onClick={onSend}
              >
                Send
              </button>
            }
          </div>
        </div>
        <div>
          {itemComments.map((comment, index) =>
            <div key={index} className="d-flex flex-row" style={{ marginTop: 12, marginLeft: 15 }}>
              <picture>
                <img
                  src={UtilService.ConvertImg(comment?.commenter?.avatar) || DEMO_AVATAR}
                  alt="photo_url"
                  style={{ width: 36, height: 36, borderRadius: 18, marginLeft: -14 }}
                  onClick={() => handleRoute(router, '/mynfts')}
                />
              </picture>
              <div className='color-b' style={{ marginLeft: 6, marginTop: -4 }}>
                <span className='fs-13' style={{ marginLeft: 6 }}>{comment?.commenter?.username}</span>
                <br />
                <span className='bg-3 fs-14' style={{ borderRadius: 18, padding: '7px 12px' }}>{comment?.comment}</span>
              </div>
            </div>
          )}
        </div>
      </div>}
    </div>
  )
}
