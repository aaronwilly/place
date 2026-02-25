import { Alchemy, Network } from 'alchemy-sdk';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ALCHEMY_KEY, PROD } from '../../keys';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';
import { TinyLoading } from '../loading';

const ModalEditNFT = ({ onClose, onAdd, onRemove, addedNFT, onAddGlobal }) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { nfts } = useSelector(state => state.nfts);
  const [searchKey, setSearchKey] = useState();
  const [tab, setTab] = useState(0);
  const [contractAddress, setContractAddress] = useState();
  const [contractTokenId, setContractTokenId] = useState();
  const [net, setNet] = useState('eth');
  const [checkLoading, setCheckLoading] = useState(false);
  const [isAll, setIsAll] = useState(true);
        
  const alchemy = new Alchemy({
    apiKey: ALCHEMY_KEY,
    network: PROD ? Network.ETH_MAINNET : Network.ETH_GOERLI,
  });

  const onSaveData = async () => {
    onClose();
  }

  const onCheckNFTIndividual = async () => {

    setCheckLoading(true);

    try {

      const data = await alchemy.nft.getNftMetadata(contractAddress, contractTokenId)

      setCheckLoading(false);
      if (data) {
        if (!data.metadataError) {
          onAddGlobal(data)
          onClose();
        } else {
          dispatch(addNotification('Metadata is not available', 'error'))
        }
      } else {
        dispatch(addNotification('Can\'t find the NFT!', 'error'))
      }
    } catch (e) {
      setCheckLoading(false);
      dispatch(addNotification(e.message, 'error'))
    }
  }

  const onCheckNFTAll = async() => {

    setCheckLoading(true);

    try {
      const data = await alchemy.nft.getNftMetadata(contractAddress, '0001')
      setCheckLoading(false);
      if (data) {
        if (!data.metadataError) {
          onAddGlobal({ ...data.result[0], isAll: true })
          onClose();
        } else {
          dispatch(addNotification('Metadata is not available', 'error'))
        }
      } else {
        dispatch(addNotification('Can\'t find the NFT!', 'error'))
      }
    } catch (e) {
      setCheckLoading(false);
      dispatch(addNotification(e.message, 'error'))
    }
  }

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Edit NFTs'}
    >

      <div className="w-100 d-flex flex-column align-items-start">
        <div className="w-100 d-flex flex-row justify-content-around color-b">
          <p className={`cursor-pointer ${tab === 0 ? 'border-4' : 'border-3'}`} onClick={() => setTab(0)}>+ Mainnet NFTs</p>
          <p className={`cursor-pointer ${tab === 1 ? 'border-4' : 'border-3'}`} onClick={() => setTab(1)}>+ Lazy NFTs</p>
          <p className={`cursor-pointer ${tab === 2 ? 'border-4' : 'border-3'}`} onClick={() => setTab(2)}>+ New NFT</p>
        </div>

        {tab === 0 && <div className="w-100 d-flex flex-column align-items-center mb-3">
          <div className="d-flex flex-row fw-semibold">
            <div className={`cursor-pointer m-2 ${net === 'eth' && 'color-sky'}`} onClick={() => setNet('eth')}>Etherem</div>
            <div className={`cursor-pointer m-2 ${net === 'bsc' && 'color-sky'}`} onClick={() => setNet('bsc')}>BSC</div>
            <div className={`cursor-pointer m-2 ${net === 'Polygon' && 'color-sky'}`} onClick={() => setNet('Polygon')}>Polygon</div>
          </div>
          <input
            className="form-control"
            placeholder="Smart Contract"
            value={contractAddress}
            onChange={e => setContractAddress(e.target.value)}
          />

          <div className='d-flex mb-4'>
            <div
              className={!isAll ? 'btn-small-deactive' : 'btn-small-active'}
              onClick={() => setIsAll(true)}
            >All IDs</div>
            <div
              className={isAll ? 'btn-small-deactive' : 'btn-small-active'}
              onClick={() => setIsAll(false)}
            >Individual</div>
          </div>

          {!isAll && <input
            className="form-control"
            placeholder="Token Id"
            value={contractTokenId}
            onChange={e => setContractTokenId(e.target.value)}
            style={{ marginTop: -15 }}
            />}

          <div className="d-flex f-1" />
          {checkLoading ? <TinyLoading /> : <input
            type="button"
            value="Add NFT"
            onClick={isAll ? onCheckNFTAll : onCheckNFTIndividual}
            className={`${(!contractAddress || (!contractTokenId && !isAll) ) && 'btn-disabled'} btn-main`}
            style={{ background: '#0075ff', marginLeft: 10 }}
          />}
        </div>}

        {tab === 1 && <div className="w-100">
          <input
            className="w-100 form-control"
            style={{ border: '1px solid #ccc' }}
            placeholder='Search NFTs'
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
          />

          <div style={{ maxHeight: 200, border: '1px solid grey', overflow: 'auto' }} className='w-100 mb-3'>
            {
              nfts.map((nft, index) => {
                const { image, name } = JSON.parse(nft.metadata);
                if (searchKey && !name?.toLowerCase().includes(searchKey?.toLowerCase())) {
                  return null
                }

                return (
                  <div key={index} className='d-flex flex-row align-items-center'>
                    <div className='width-50 height-50 d-flex align-items-center justify-content-center'>
                      <img
                        src={image}
                        alt=""
                        style={{ width: 'auto', maxHeight: 40, maxWidth: 40 }}
                      />
                    </div>
                    <div style={{ marginLeft: 12, flex: 1 }}>
                      {name}
                    </div>
                    {addedNFT.includes(nft.token_id) ? <span
                      className="icon_circle-slelected cursor-pointer"
                      onClick={() => onRemove(nft.token_id)}
                      style={{ marginRight: 12, fontSize: 24 }}></span>
                      : <span
                        className="icon_circle-empty cursor-pointer"
                        onClick={() => onAdd(nft.token_id)}
                        style={{ marginRight: 12, fontSize: 24 }}></span>}
                  </div>
                )
              })
            }
          </div>
          <div className="w-100 mt-3 d-center">
            <input
              type="button"
              value="Save"
              onClick={onSaveData}
              className='btn-main'
              style={{ background: '#0075ff', marginLeft: 10 }}
            />
          </div>
        </div>}

        {tab === 2 && <div className="w-100 mt-5 mb-3 d-center f-1">
          <div
            style={{ background: '#0075ff', marginLeft: 10 }}
            onClick={() => router.push('/makeNFTs', undefined, { shallow: true })} className='btn-main'>
            Go to Create Page
          </div>

        </div>}
      </div>
    </LayoutModal>
  );
};

export default ModalEditNFT;
