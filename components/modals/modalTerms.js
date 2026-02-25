import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import LayoutModal from '../layouts/layoutModal';
import { useWeb3Auth } from '../../services/web3auth';
import { createTermsAccepted, getTermsAccepted } from '../../common/api/authApi';

const ModalTerms = ({ onClose, onGo, email }) => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [isEnabled, setIsEnabled] = useState(false)

  const onSaveData = async () => {
    const ownerId = email ? user._id : user?.account
    const response = await getTermsAccepted({ owner: ownerId })
    if (!response) {
      await createTermsAccepted({
        owner: ownerId,
        agreed: true
      })
    }
    onGo()
  }

  const onCloseModal = () => {
    router.push('/', undefined, { shallow: true }).then()
    onClose()
  }

  return (
    <LayoutModal isOpen={true} title={'Welcome to Klik!'} onClose={onClose}>
      <p>By using Klik, you agree to the <Link href='/termsOfService' style={{ color: '#0075ff' }} prefetch={false}>Terms
        of Service.</Link></p>

      <div className='d-flex flex-row'>
        <input
          type="checkbox"
          id="submit"
          style={{ width: 20, height: 20, marginRight: 10 }}
          value={isEnabled}
          onChange={e => setIsEnabled(e.target.checked)}
        />
        <p>I agree</p>
      </div>

      <div className="row justify-content-center">
        <div className="width-100 offer-btn" onClick={onCloseModal} style={{ marginRight: 20 }}>Cancel</div>
        <div className={`width-200 offer-btn buy-btn ${!isEnabled ? 'btn-disabled' : ''}`} onClick={onSaveData}>Let's go</div>
      </div>
    </LayoutModal>
  );
};

export default ModalTerms;
