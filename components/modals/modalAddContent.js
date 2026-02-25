import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import LayoutModal from '../layouts/layoutModal';
import ModalAddNFTCommunity from './modalAddNFTCommunity';
import GatedNFTDisplayNew from '../cards/GatedNFTDisplayNew';
import CustomThumbnailSmallVideo from '../custom/CustomThumbnailSmallVideo';
import { useWeb3Auth } from '../../services/web3auth';
import { getDiscourses, getMusics, getVideos } from '../../common/api/authApi';
import { handleRoute } from '../../common/function';
import { CONTENTTYPES } from '../../constants/dropdownlist';

const ButtonBox = styled.div`
  width: 160px;
  height: 41px;
  border: 1px solid #444;
  border-radius: 5px;
  margin: 4px 10px 4px 0;
  color: #bbb;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => props.active &&
    css`
      background: #0075ff;
      color: #fff;
      border: none;
    `
  }
`

const Title = styled.div`
  font-size: 17px;
  font-weight: 500;
  color: #bbb;
`

const ModalAddContent = ({ onClose, editData, onSave, addedContent }) => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [contentTitle, setContentTitle] = useState('')
  const [contentLink, setContentLink] = useState('')
  const [trigger, setTrigger] = useState(1)
  const [type, setType] = useState()
  const [isModalNFT, setIsModalNFT] = useState(false)
  const [addedNFT, setAddedNFT] = useState([])
  const [videoData, setVideoData] = useState([])
  const [discourseData, setDiscourseData] = useState([])
  const [musicData, setMusicData] = useState([])

  useEffect(() => {
    if (editData) {
      setType(editData.type)
      setContentTitle(editData.title)
      setContentLink(editData.link)
      setAddedNFT(editData.nfts)
    }
  }, [editData])

  useEffect(() => {
    const loadData = async () => {
      const response1 = await getVideos({ creatorId: user?.account })
      response1 && setVideoData(response1)
      const response2 = await getDiscourses({ creatorId: user?.account })
      response2 && setDiscourseData(response2)
      const response3 = await getMusics({ creatorId: user?.account })
      response3 && setMusicData(response3)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  useEffect(() => {
    setTimeout(() => setTrigger(trigger + 1), 1000)
  }, [])

  const onSaveData = async () => {
    const newData = {
      id: uuidv4(),
      type,
      title: contentTitle,
      link: contentLink,
      createdAt: new Date(),
      nfts: addedNFT
    };

    let content;
    if (editData) {
      const newAddedContent = addedContent.filter(t => t.id !== editData.id);
      content = [...newAddedContent, newData]
    } else {
      content = [...addedContent, newData]
    }

    onSave(content)
    onClose();
  }

  const onCloseNFTModal = () => {
    setIsModalNFT(false);
  }

  return (
    <LayoutModal isOpen={true} title={editData ? 'Edit Content' : 'Add Content'} onClose={onClose}>
      <h3 className="color-sky text-center" />

      <div className="w-100 d-flex flex-column align-items-start">
        <Title>What do you wanna add?</Title>
        <div className='d-flex flex-wrap'>
          {CONTENTTYPES.map((item, p) =>
            <ButtonBox
              key={p}
              active={type?.value === item?.value}
              onClick={() => {
                setType(item)
                setContentLink('')
              }}
            >
              <picture>
                <img src={`/img/icons/${item.icon}`} alt="icon" style={{ width: 26, marginRight: 7 }} />
              </picture>
              <span className="f-16">{item.label}</span>
            </ButtonBox>
          )}
        </div>

        <div className='w-100'>
          <br />
          {type && <Title>Set a title</Title>}
          {type &&
            <input
              className="form-control"
              placeholder='e.g. exclusive video'
              value={contentTitle}
              onChange={e => setContentTitle(e.target.value)}
            />
          }

          {type && type?.value !== 'video' && type?.value !== 'Discord' && type?.value !== 'Music' &&
            <Title>Add a link</Title>
          }
          {type && type?.value !== 'video' && type?.value !== 'Discord' && type?.value !== 'Music' &&
            <input
              className="form-control"
              placeholder='add a link about your content.'
              value={contentLink}
              onChange={e => setContentLink(e.target.value)}
            />
          }

          {type?.value === 'video' &&
            <div className="container d-flex flex-row flex-wrap ">
              {videoData.map((item, index) =>
                <CustomThumbnailSmallVideo
                  key={index}
                  video={item}
                  checkable={true}
                  contentLink={contentLink}
                  onChange={e => setContentLink(e)}
                />
              )}

              {videoData.length === 0 &&
                <div>
                  <p className="text-danger">User does not have any videos to add to community page</p>
                  <div
                    style={{ width: 80, height: 80, border: '2px dashed #bbb' }}
                    className='d-flex align-items-center justify-content-center cursor-pointer'
                    onClick={() => handleRoute(router, '/myvideos')}
                  >
                    <span className="icon_plus_alt2 fs-24" />
                  </div>
                </div>
              }
            </div>
          }

          {type?.value === 'Discord' &&
            <div className="container d-flex flex-row flex-wrap">
              {discourseData.map((item, index) =>
                <div
                  key={index}
                  className='cursor-pointer'
                  style={{
                    padding: '5px 12px',
                    border: '1px solid #444',
                    borderRadius: 4,
                    margin: 4,
                    background: contentLink === item.id ? '#0075ff' : 'transparent',
                    color: '#fff'
                  }}
                  onClick={() => setContentLink(item.id)}
                >
                  <picture>
                    <img src={'/img/icons/ic_discord.png'} alt="icon" style={{ width: 22, marginRight: 7 }} />
                  </picture>
                  {item?.title}
                </div>
              )}

              {discourseData.length === 0 &&
                <div>
                  <p className="text-danger">User does not have any discourse to add to community page</p>
                </div>
              }
            </div>
          }

          {type?.value === 'Music' &&
            <div className="container d-flex flex-row flex-wrap">
              {musicData.map((item, index) =>
                <div
                  key={index}
                  className='cursor-pointer'
                  style={{
                    padding: '5px 12px',
                    border: '1px solid #444',
                    borderRadius: 4,
                    margin: 4,
                    background: contentLink === item.id ? '#0075ff' : 'transparent',
                    color: '#fff'
                  }}
                  onClick={() => setContentLink(item.id)}
                >
                  <picture>
                    <img src={'/img/icons/ic_music.png'} alt="icon" style={{ width: 18, marginRight: 7 }} />
                  </picture>
                  {item?.title}
                </div>
              )}

              {musicData.length === 0 && <p className="text-danger">User does not have any music to add to community page</p>}
            </div>
          }
        </div>
      </div>

      <div className="spacer-single mb-1" />

      {addedNFT.length > 0 ?
        <GatedNFTDisplayNew editable data={addedNFT} setAddedNFT={setAddedNFT} />
        :
        <div className="text-center">No NFTs Added!</div>
      }

      <div className="mt-3 row justify-content-center">
        <div className="offer-btn" style={{ width: 120, marginRight: 20 }} onClick={() => setIsModalNFT(true)}>
          Add NFT
        </div>

        <div
          className={`offer-btn buy-btn ${(!type || !contentTitle || !contentLink) && 'btn-disabled'}`}
          style={{ width: 200 }}
          onClick={onSaveData}
        >
          Save
        </div>
      </div>

      {isModalNFT && <ModalAddNFTCommunity addedNFT={addedNFT} setAddedNFT={setAddedNFT} onClose={onCloseNFTModal}/>}
    </LayoutModal>
  );
};

export default ModalAddContent;
