import React, { useState } from 'react';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateFilter, onUpdateSearch } from '../../store/actions/nfts/nfts';
import { BigSVG, RefreshSVG, SmallSVG } from '../../common/svg';

const Box = styled.div`
  min-width: auto;
  background: #222528;
  border-radius: 16px;
  margin: 0 7px;
  padding: 8px 18px;
  font-size: 14px;
  transform-origin: center center;
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
`

const Box1 = styled.div`
  min-width: auto;
  background: #222528;
  border-radius: 16px;
  margin: 0 7px;
  padding: 1px 8px;
  font-size: 14px;
  transform-origin: center center;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
`

const IconSearch = styled.span`
  cursor: pointer;
  position: absolute;
  top: 13px;
  left: 12px;
`
const Sel = styled.span`
  background: ${props => !props.sel ? '#191c1f' : '#222528'};
  border-radius: 16px;
  margin: 0 2px;
  padding: 5px 10px;
  cursor: pointer;
`

const ProfileFilterBar = ({ onRefresh }) => {

  const dispatch = useDispatch()
  const { filter } = useSelector(state => state.nfts);
  const { visible, isBig } = filter;

  const [text, setText] = useState('')
  const debounced = useDebouncedCallback((value) => {
    dispatch(onUpdateSearch({ searchKey: value }))
    dispatch(onUpdateFilter({ searchText: value }))
  }, 1000);

  return (
    <div className='m-4 d-flex flex-row'>
      <Box onClick={() => dispatch(onUpdateFilter({ visible: !visible }))}>Filters</Box>

      <Box onClick={onRefresh}>
        <RefreshSVG />
      </Box>

      <div className='w-100 mx-2 position-relative'>
        <input
          className='w-100 m-0 form-control'
          style={{ border: '1px solid #ccc', borderRadius: 16, paddingLeft: 40 }}
          placeholder='Search'
          value={text}
          onChange={e => { setText(e.target.value); debounced(e.target.value) }}
        />
        <IconSearch className='icon_search' />
      </div>

      <Box1>
        <Sel sel={isBig} onClick={() => dispatch(onUpdateFilter({ isBig: false }))}>
          <BigSVG />
        </Sel>

        <Sel sel={!isBig} onClick={() => dispatch(onUpdateFilter({ isBig: true }))}>
          <SmallSVG />
        </Sel>
      </Box1>
    </div>
  );
}

export default ProfileFilterBar;
