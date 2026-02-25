import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Channel, ChannelList, Chat } from 'stream-chat-react';
import {
  CreateChannel,
  CustomMessage,
  MessagingChannelList,
  MessagingChannelPreview,
  MessagingInput,
  MessagingThreadHeader,
} from '../components/chat/components';
import { useChecklist } from '../components/chat/ChecklistTasks';
import { ChannelInner } from '../components/chat/components/ChannelInner/ChannelInner';
import { useWeb3Auth } from '../services/web3auth';
import UtilService from '../sip/utilService';
import { StreamAccessKey } from '../keys';

const urlParams = new URLSearchParams(typeof window !== 'undefined' && window.location.search);

const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const options = { state: true, watch: true, presence: true, limit: 8 };

const sort = {
  last_message_at: -1,
  updated_at: -1,
};

export const GiphyContext = React.createContext({});

const AppChat = () => {

  const { user: metaUser } = useWeb3Auth()
  const [theme, setTheme] = useState('dark')
  const [chatClient, setChatClient] = useState(null)
  const [giphyState, setGiphyState] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isMobileNavVisible, setMobileNav] = useState(false)

  const profile = null
  const client = StreamChat.getInstance(StreamAccessKey, {
    enableInsights: true,
    enableWSFallback: true,
  })

  useChecklist(chatClient, targetOrigin)

  useEffect(() => {
    const initChat = async () => {

      await client.connectUser(
        {
          id: metaUser?._id,
          name: metaUser?.username,
          image: UtilService.ConvertImg(metaUser?.avatar),
        },
        client.devToken(metaUser?._id),
      );

      await client.upsertUser({
        id: metaUser?._id,
        name: metaUser?.username,
        image: UtilService.ConvertImg(metaUser?.avatar),
      })

      setChatClient(client)
    };

    metaUser && initChat()

    return () => chatClient?.disconnectUser()
  }, [metaUser, profile]);

  useEffect(() => {
    const handleThemeChange = ({ data, origin }) => {
      if (origin === targetOrigin) {
        if (data === 'light' || data === 'dark') {
          setTheme(data);
        }
      }
    };

    window.addEventListener('message', handleThemeChange)

    return () => window.removeEventListener('message', handleThemeChange)
  }, []);

  useEffect(() => {
    const mobileChannelList = document.querySelector('#mobile-channel-list');
    if (isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.add('show');
      document.body.style.overflow = 'hidden';
    } else if (!isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }, [isMobileNavVisible]);

  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    setAppHeight();

    window.addEventListener('resize', setAppHeight)

    return () => window.removeEventListener('resize', setAppHeight)
  }, []);

  const toggleMobile = () => setMobileNav(!isMobileNavVisible);

  const giphyContextValue = { giphyState, setGiphyState };

  if (!chatClient) return null;
  if (!metaUser) return null;

  const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
  };

  return (
    <div style={{ margin: 70, marginBottom: 0 }}>
      <Chat client={chatClient} theme={`messaging ${theme}`}>
        <div id='mobile-channel-list'>
          <ChannelList
            filters={{ type: 'messaging', members: { $in: [metaUser?._id || 1216818] } }}
            sort={sort}
            options={options}
            List={(props) => <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />}
            Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
          />
        </div>
        <div>
          <Channel
            Input={MessagingInput}
            maxNumberOfFiles={10}
            Message={CustomMessage}
            multipleUploads={true}
            ThreadHeader={MessagingThreadHeader}
            TypingIndicator={() => null}
          >
            {isCreating && <CreateChannel toggleMobile={toggleMobile} onClose={() => setIsCreating(false)} />}
            <GiphyContext.Provider value={giphyContextValue}>
              <ChannelInner theme={theme} toggleMobile={toggleMobile} />
            </GiphyContext.Provider>
          </Channel>
        </div>
      </Chat>
    </div>
  );
};

export default AppChat;
