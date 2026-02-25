import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { onLikes } from '../../common/web3Api';
import { GetAllLikes } from '../../common/api/noAuthApi';
import { handleRoute } from '../../common/function';
import { DEMO_AVATAR } from '../../keys';

const Title = styled.div`
  font-size: 35px;
  font-weight: 600;

  @media only screen and (max-width: 600px) {
    font-size: 20px;
  }
`

const ItemRightHeader = ({ myNFT, brand, creator, totalSupply }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [trigger, setTrigger] = useState(1)
  const [lazyMintLikes, setLazyMintLikes] = useState([])

  const { token_id: ercTokenId, token_address } = router.query
  const { name } = (myNFT?.metadata && JSON.parse(myNFT?.metadata)) || '-'
  const isERC1155 = myNFT?.contract_type === 'ERC1155';
  const nftName = name || myNFT?.name;
  const likedByMe = lazyMintLikes.find(item => item?.likerId === user?.account)

  useEffect(() => {
    const loadData = async () => {
      const response = await GetAllLikes({ lazyMintId: ercTokenId })
      response && setLazyMintLikes(response)
    }

    loadData().then()
  }, [ercTokenId, trigger])

  const onLikeNFT = async () => {
    const likeData = { lazyMintId: ercTokenId, type: 'nft', likerId: user?.account, router }
    dispatch(onLikes(likeData, () => setTrigger(trigger + 1)))
  }

  // console.log('myNFT: ', myNFT)

  return (
    <div>
      {nftName ?
        <Title className="color-b">{nftName}</Title>
        :
        <Skeleton count={1} height={36} />
      }

      <div className='color-b d-flex flex-row-responsive align-items-center'>
        {!isERC1155 &&
          <div>
            {myNFT?.owner_of ?
              <div style={{ marginRight: 24 }}>Owned by &nbsp;
                <span className='cursor-pointer' style={{ color: '#2082e1' }} onClick={() => handleRoute(router, `/sales/${myNFT?.owner_of?.account}`)}>
                  {myNFT?.owner_of?.username || UtilService.truncate(myNFT?.owner_of)}
                </span>
              </div>
              :
              <Skeleton count={1} height={20} width={200} />
            }
          </div>
        }
        &nbsp;&nbsp;

        {myNFT?.owner_of ?
          <div className='d-flex flex-row-responsive align-items-center'>
            <div className='cursor-pointer' onClick={onLikeNFT}>
              <span style={{ marginRight: 12, color: likedByMe ? '#ff343f' : '#666' }} aria-hidden="true" className="icon_heart"></span>
              {lazyMintLikes?.length || 0} favorites
            </div>
            {isERC1155 && <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className='icon_grid-3x3 ml-4'></span> {myNFT?.supply || totalSupply} items</div>}
            {isERC1155 && (myNFT?.owner_of?.account || myNFT?.owner_of) === user?.account && myNFT?.amount > 0 && <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className='icon_profile ml-4'></span> You own {myNFT?.amount}</div>}
          </div>
          :
          <Skeleton count={1} height={20} width={200} />
        }
      </div>

      <br />

      {UtilService.checkMetasalt(token_address) &&
        <div>
          {(creator && myNFT) ?
            <div className="br-8 color-b" style={{ background: '#171a1b', border: '1px solid #333' }}>
              <div className='d-flex flex-row-responsive'>
              <div className="ml-10 mb-10 d-flex flex-row f-1">
                <picture>
                  <img
                    className="width-50 height-50 br-50 object-cover mt-2 cursor-pointer"
                    src={UtilService.ConvertImg(creator?.avatar) || DEMO_AVATAR}
                    alt='avatar'
                    onClick={() => handleRoute(router, `/sales/${creator?.account}`)}
                  />
                </picture>
                <div style={{ marginLeft: 10 }}>
                  <div className="mt-16 fw-semibold">Creator</div>
                  <div style={{ fontSize: 12 }}>{creator?.username}</div>
                </div>
              </div>

              {brand &&
                <div className="ml-10 mb-10 d-flex flex-row f-1">
                  <picture>
                    <img
                      src={UtilService.ConvertImg(brand?.avatar) || DEMO_AVATAR}
                      alt='avatar'
                      className="width-50 height-50 br-50 object-cover mt-2 cursor-pointer"
                      onClick={() => handleRoute(router, `/brands/${brand?._id}`)}
                    />
                  </picture>
                  <div style={{ marginLeft: 10 }}>
                    <div className="mt-16 fw-semibold">Brand</div>
                    <div style={{ fontSize: 12 }}>{brand?.title}</div>
                  </div>
                </div>
              }

              {myNFT?.collection &&
                <div className="ml-10 mb-10 d-flex flex-row f-1">
                  <picture>
                    <img
                      className="width-50 height-50 br-50 object-cover mt-2 cursor-pointer"
                      src={UtilService.ConvertImg(myNFT?.collection?.avatar) || DEMO_AVATAR}
                      alt='avatar'
                      onClick={() => handleRoute(router, `/subCollection/${myNFT?.collection?.id}`)}
                    />
                  </picture>
                  <div style={{ marginLeft: 10 }}>
                    <div className="mt-16 fw-semibold">Collection</div>
                    <div style={{ fontSize: 12, maxHeight: 22, overflow: 'hidden' }}>{myNFT?.collection?.title}</div>
                  </div>
                </div>
              }
            </div>
            </div>
            :
            <div />
          }
        </div>
      }
    </div>
  );
}

export default ItemRightHeader;
