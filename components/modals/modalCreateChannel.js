import React, { useState } from 'react';
import LayoutModal from '../layouts/layoutModal';
import { useWeb3Auth } from '../../services/web3auth';
import { createDiscourseChannel } from '../../common/api/authApi';

const ModalCreateChannel = ({ discourseId, onSuccess, onClose }) => {

  const { user } = useWeb3Auth()
  const [channelName, setChannelName] = useState('')

  const onCreateChannel = async() => {
    await createDiscourseChannel({
      discourseId,
      title: channelName,
      creatorId: user?.account,
    })
    setChannelName(null);
    onSuccess();
  }

  return (
    <LayoutModal isOpen={true} title={'Create a channel'} onClose={onClose}>
      <div className="color-b">Channel Name</div>

      <input
        name="item_name"
        id="item_name"
        className="form-control mt-1"
        placeholder="e.g. general"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />

      <div className="color-b">Private Channel</div>
      <div className="color-7">By making a channel private, only selected roles will have access to read or connect to this channel</div>

      <div className="spacer-10"></div>

      <div className="mt-3 row justify-content-center">
        <div className="width-100 offer-btn" onClick={onClose} style={{ marginRight: 20 }}>
          Cancel
        </div>

        <div className={`width-200 offer-btn buy-btn ${(!channelName) && 'btn-disabled'}`} onClick={onCreateChannel}>
          Create Channel
        </div>
      </div>
    </LayoutModal>
  );
};

export default ModalCreateChannel;
