import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeb3Auth } from '../../services/web3auth';
import { GetDiscourseChannel, GetDiscourseMessages } from '../../common/api/noAuthApi';
import { createDiscourseMessage } from '../../common/api/authApi';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR } from '../../keys';

const Box = styled.div`
  width: 100%;
  background: #36393f;
  padding: 1.5rem !important;
  color: #bbb;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 768px) {
    padding: 5px !important;
  }
`

const Container = styled.div`
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  flex: 1;

  @media only screen and (max-width: 768px) {
    max-height: calc(100vh - 350px);
  }
`

const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 23px;
  margin: 4px;

  @media only screen and (max-width: 768px) {
    width: 26px;
    height: 26px;
    border-radius: 13px;
    margin: 2px;
  }
`

const UserName = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #F6931A !important;

  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`

const Text = styled.div`
  max-width: 700px;

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`

const ChannelList = ({ discourseId, channelId }) => {

  const { user } = useWeb3Auth()
  const [trigger, setTrigger] = useState(0)
  const [textMessage, setTextMessage] = useState('')
  const [channel, setChannel] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const response1 = await GetDiscourseChannel({ _id: channelId })
      response1 && setChannel(response1)
      const response2 = await GetDiscourseMessages({ channelId: channelId })
      response2 && setMessages(response2)
    }

    loadData().then()
  }, [channelId, trigger])

  const onSendMessage = async () => {
    setTextMessage('')
    const response = await createDiscourseMessage({
      discourseId,
      channelId,
      msg: textMessage,
      creatorId: user?.account,
    })
    response && setTrigger(trigger + 1)
  }

  return (
    <Box>
      <Text className='fs-20 fw-semibold'># {channel?.title}</Text>

      <Container>
        <div className='w-100'>
          {messages.map((item, index) => {
            const isMe = item?.creator?.account === user?.account;
            return <div key={index} className={`m-2 d-flex ${!isMe ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`d-flex ${!isMe ? 'flex-row justify-content-start' : 'flex-row-reverse justify-content-end'}`}>
                <Avatar src={UtilService.ConvertImg(item?.creator?.avatar) || DEMO_AVATAR} alt='avatar'/>
                <div className='ml-2 mr-2'>
                  <UserName style={{ textAlign: isMe ? 'right' : 'left' }}>{item?.creator?.username}</UserName>
                  <Text style={{ maxWidth: 700 }}>{item?.msg}</Text>
                </div>
              </div>
            </div>
          })}
        </div>
      </Container>

      <div>
        {/* <InputEmoji
          className='mt-2 mb-0 form-control'
          type='text'
          placeholder='Type a Message'
          value={textMessage}
          onChange={(e) => setTextMessage(e)}
          onEnter={(e) => onSendMessage(e)}
        /> */}
      </div>
    </Box>
  )
}

export default ChannelList;
