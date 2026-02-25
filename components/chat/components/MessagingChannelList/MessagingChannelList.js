import { useRouter } from 'next/router';
import React, { memo, useEffect } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { SkeletonLoader } from './SkeletonLoader';
import CustomPopover from '../../../custom/CustomPopover';
import { useWeb3Auth } from '../../../../services/web3auth';
import { CreateChannelIcon } from '../../assets';
import UtilService from '../../../../sip/utilService';
import { DEMO_AVATAR } from '../../../../keys';

const MessagingChannelList = ({ children, error = false, loading, onCreateChannel }) => {

  const router = useRouter()
  const { allUsers: users } = useWeb3Auth()
  const { client, setActiveChannel } = useChatContext()

  const { id, image, name = 'Example User' } = client.user || {}
  const newUser = router.query?.new

  useEffect(() => {
    const getDemoChannel = async (client) => {
      const channel = client.channel('messaging', 'first', { name: 'Klik Chat', demo: 'social' });
      await channel.watch();
      await channel.addMembers([client.user.id]);

      setActiveChannel(channel);
    };

    if (!loading && !children?.props?.children?.length) {
      getDemoChannel(client).then()
    }
  }, [loading])

  useEffect(() => {
    const createChannel = async (x) => {

      const selectedUser = users?.find(u => x === u._id);

      await client.upsertUser({
        id: x,
        name: selectedUser?.username,
        image: selectedUser?.avatar
      });

      const conversation = await client.channel('messaging', {
        members: [x, client.userID],
      });

      await conversation.watch();

      setActiveChannel(conversation);
    };

    if (newUser && client) {
      createChannel(newUser).then()
    }
  }, [newUser, client])

  const ListHeaderWrapper = ({ children }) => {
    return (
      <div className='messaging__channel-list'>
        <div className='messaging__channel-list__header'>
          <Avatar image={UtilService.ConvertImg(image) || DEMO_AVATAR} name={name} size={40} />
          <div className='messaging__channel-list__header__name'>
            <CustomPopover content={name || id} placement='bottom'>
              {name || id}
            </CustomPopover>
          </div>
          <button className='messaging__channel-list__header__button' onClick={onCreateChannel}>
            <CreateChannelIcon />
          </button>
        </div>
        {children}
      </div>
    );
  };

  if (error) {
    return (
      <ListHeaderWrapper>
        <div className='messaging__channel-list__message'>
          Error loading conversations, please try again momentarily.
        </div>
      </ListHeaderWrapper>
    );
  }

  if (loading) {
    return (
      <ListHeaderWrapper>
        <div className='messaging__channel-list__message'>
          <SkeletonLoader />
        </div>
      </ListHeaderWrapper>
    );
  }

  return <ListHeaderWrapper>{children}</ListHeaderWrapper>;
};

export default memo(MessagingChannelList);
