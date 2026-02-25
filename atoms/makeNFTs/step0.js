import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateCreator } from '../../store/actions/nfts/nfts';
import { MintLottie } from '../../components/loading';
import ModalBrandCollectionWarning from '../../components/modals/warnings/modalBrandCollectionWarning';

const Step0 = ({ brands }) => {

  const dispatch = useDispatch()
  const [isModal, setIsModal] = useState(false)

  const { nft } = useSelector(state => state.nfts);
  const { brand, collection } = nft;

  const onStart = () => {
    if (!brand || !collection) {
      setIsModal(true)
    } else {
      dispatch(onUpdateCreator({ step: 1 }))
    }
  }

  return (
    <div className='d-flex flex-column align-items-center justify-content-center'>
      <MintLottie/>
      <br/>
      {brands?.length === 0 &&
        <div className="alert alert-danger text-center" style={{ marginTop: 20 }}>
          Create <Link href='/create/brand' prefetch={false} className='text-decoration-underline'> brand</Link> to authenticate. Skip if not authentication is required.
        </div>
      }
      <button className='btn btn-primary' onClick={() => onStart()}>Start</button>

      {isModal && <ModalBrandCollectionWarning onContinue={() => dispatch(onUpdateCreator({ step: 1 }))} onClose={() => setIsModal(false)} />}
    </div>
  )
}

export default Step0;
