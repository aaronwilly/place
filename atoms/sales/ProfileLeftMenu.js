import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateSearch } from '../../store/actions/nfts/nfts';
import useWindowSize from '../../hooks/useWindowSize';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR } from '../../keys';

const Root = styled.div`
  min-width: 360px;
  height: 800px;
  border: 1px solid #444;
  border-radius: 20px;
  margin-left: 20px;
  padding: 20px;
  overflow: auto;
  position: sticky;
  top: 130px;
  bottom: 20px;
`

const CheckBox = styled.input`
  width: 20px;
  height: 20px;
`

const Icon = styled.img`
  width: 20px;
  cursor: pointer;
  transform: rotate(${props => props.opened ? 90 : 270}deg);
  transition: transform .2s ease-in-out;
`

const Box = styled.div`
  margin: 12px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #555;
  margin: 22px 0;
`

const Title = styled.div`
  height: 25px;
  font-size: 14px;
  overflow: hidden;
  display: flex;
  flex: 1
`

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  margin-right: 9px;
`

const ProfileLeftMenu = ({ allBrands = [], allCollections = [], show = true }) => {

  const dispatch = useDispatch()
  const { height, width } = useWindowSize()
  const [isExpandStatus, setIsExpandStatus] = useState(false)
  const [isExpandQuantity, setIsExpandQuantity] = useState(false)
  const [isExpandChains, setIsExpandChains] = useState(true)

  const { search } = useSelector(state => state.nfts);
  const { lazyMint, normalMint, erc721, erc1155, buynow, cols, brands, eth, matic } = search;

  return (
    <Root>
      <div style={width <= 850 ? { maxHeight: height - 150, overflow: 'auto' } : {}}>
        <Box>
          <div className='w-100 fw-semibold'>Chains</div>
          <Icon src='/img/icons/ic_back.png' alt='back' onClick={() => setIsExpandChains(!isExpandChains)} opened={isExpandChains} />
        </Box>

        {isExpandChains &&
          <div>
            <Box>
              <div className='w-100'>Ethereum</div>
              <CheckBox type='checkbox' label='I agree' value={eth} onChange={e => dispatch(onUpdateSearch({ eth: e.target.checked }))} />
            </Box>

            <Box>
              <div className='w-100'>Polygon</div>
              <CheckBox type='checkbox' label='I agree' value={matic} onChange={e => dispatch(onUpdateSearch({ matic: e.target.checked }))} />
            </Box>
          </div>
        }

        <Divider />

        <Box>
          <div className='w-100 fw-semibold'>Status</div>
          <Icon src='/img/icons/ic_back.png' alt='back' onClick={() => setIsExpandStatus(!isExpandStatus)} opened={isExpandStatus} />
        </Box>

        {isExpandStatus &&
          <div>
            <Box>
              <div className='w-100'>Buy Now</div>
              <CheckBox type='checkbox' label='I agree' value={buynow} onChange={e => dispatch(onUpdateSearch({ buynow: e.target.checked }))} />
            </Box>

            <Box>
              <div className='w-100'>Lazy Minted</div>
              <CheckBox type='checkbox' label='I agree' value={lazyMint} onChange={e => dispatch(onUpdateSearch({ lazyMint: e.target.checked }))} />
            </Box>

            <Box>
              <div className='w-100'>Normal Minted</div>
              <CheckBox type='checkbox' label='I agree' value={normalMint} onChange={e => dispatch(onUpdateSearch({ normalMint: e.target.checked }))} />
            </Box>
          </div>
        }

        <Divider />

        <Box>
          <div className='w-100 fw-semibold'>Quantity</div>
          <Icon src='/img/icons/ic_back.png' alt='back' opened={isExpandQuantity} onClick={() => setIsExpandQuantity(!isExpandQuantity)} />
        </Box>

        {isExpandQuantity &&
          <div>
            <Box>
              <div className='w-100'>Single Items</div>
              <CheckBox type='checkbox' label='I agree' value={erc721} onChange={e => dispatch(onUpdateSearch({ erc721: e.target.checked }))} />
            </Box>

            <Box>
              <div className='w-100'>Bundles</div>
              <CheckBox type='checkbox' label='I agree' value={erc1155} onChange={e => dispatch(onUpdateSearch({ erc1155: e.target.checked }))} />
            </Box>
          </div>
        }
{/* 
        <Divider />

        {show &&
          <Box>
            <div className='w-100 fw-semibold'>Collections</div>
            <Icon src='/img/icons/ic_back.png' alt='back' opened={isExpandCollections} onClick={() => setIsExpandCollections(!isExpandCollections)} />
          </Box>
        }

        {isExpandCollections &&
          <div>
            <input
              className='w-100 form-control'
              style={{ border: '1px solid #ccc' }}
              placeholder='Filter'
              value={collectionKey}
              onChange={e => setCollectionKey(e.target.value)}
            />
            {collectionKey}
            <div>
              {filteredCollections.map((item, index) => {
                return (
                  <Box key={index}>
                    <Avatar src={UtilService.ConvertImg(item?.avatar)} alt='col' />
                    <Title>{item?.title}</Title>
                    <div className='mr-2'>{item?.volume}</div>
                    <CheckBox
                      type='checkbox'
                      label='I agree'
                      value={cols.includes(item?._id)}
                      onChange={() => {
                        let col;
                        if (!cols.includes(item?._id)) {
                          col = cols.concat(item?._id)
                        } else {
                          col = cols.filter(x => x !== item?._id)
                        }
                        dispatch(onUpdateSearch({ cols: col }))
                      }}
                    />
                  </Box>
                )
              })}
            </div>
          </div>
        } */}

        {/* {show && <Divider />}

        {show &&
          <Box>
            <div className='w-100 fw-semibold'>Brands</div>
            <Icon src='/img/icons/ic_back.png' alt='back' onClick={() => setIsExpandBrands(!isExpandBrands)} opened={isExpandBrands} />
          </Box>
        } */}

        {/* {isExpandBrands &&
          <div>
            <input
              className='w-100 form-control'
              style={{ border: '1px solid #ccc' }}
              placeholder='Filter'
              value={brandKey}
              onChange={e => setBrandKey(e.target.value)}
            />
            <div>
              {filteredBrands.filter(item => brandKey ? item?.title?.includes(brandKey) : item).map((item, index) => {
                return (
                  <Box key={index}>
                    <Avatar src={UtilService.ConvertImg(item?.avatar) || DEMO_AVATAR} alt='col' />
                    <Title>{item?.title}</Title>
                    <div className='mr-2'>{item?.volume}</div>
                    <CheckBox
                      type='checkbox'
                      label='I agree'
                      value={brands.includes(item._id)}
                      onChange={() => {
                        let brandy;
                        if (!brands.includes(item._id)) {
                          brandy = brands.concat(item._id)
                        } else {
                          brandy = brands.filter(x => x !== item._id)
                        }
                        dispatch(onUpdateSearch({ brands: brandy }))
                      }}
                    />
                  </Box>
                )
              })}
            </div>
          </div>
        } */}
      </div>
    </Root>
  );
}

export default ProfileLeftMenu;
