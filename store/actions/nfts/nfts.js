import _ from 'underscore';
import * as actionTypes from '../actionTypes';
import { onGetSearchData } from '../../../common/web3Api';

export const get721Data = (data) => ({
  type: actionTypes.GET_NFT721_DATA,
  payload: data || []
});

export const getLazyCollectionData = (data) => ({
  type: actionTypes.GET_LAZY_COLLECTION_DATA,
  payload: data
});

export const isLoading = (data) => ({
  type: actionTypes.UPDATE_IS_LOADING,
  payload: data
});

export const onUpdateCreator = (data) => ({
  type: actionTypes.UPDATE_CREATOR_NFT,
  payload: data
});

export const onRemoveCreator = () => ({
  type: actionTypes.EMPTY_CREATOR_NFT,
});

export const onUpdateGated = (data) => ({
  type: actionTypes.UPDATE_GATED_NFT,
  payload: data
});

export const onRemoveGated = () => ({
  type: actionTypes.EMPTY_GATED_NFT,
});

export const onUpdateSearch = (data) => ({
  type: actionTypes.UPDATE_SEARCH,
  payload: data
});
export const onUpdateFilter = (data) => ({
  type: actionTypes.UPDATE_FILTER,
  payload: data
});
export const onEmptySearch = (data) => ({
  type: actionTypes.EMPTY_SEARCH,
  payload: data
});

export const onGetData = () => {
  return async (dispatch) => {
    dispatch(isLoading(true));

    dispatch(onGetSearchData(null, (res) => {
      dispatch(get721Data(res));
    }))

    dispatch(isLoading(false));
  }
};
