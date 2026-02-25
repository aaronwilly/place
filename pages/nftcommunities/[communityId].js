import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import NFTCommunity from '../../components/cards/NFTCommnuity';
import ModalAddContent from '../../components/modals/modalAddContent';
import ModalDeleteCommunity from '../../components/modals/modalDeleteCommunity';
import { BlackLoading } from '../../components/loading';
import { CustomDropDown } from '../../components/custom/customDropDown';
import { useWeb3Auth } from '../../services/web3auth';
import { onLikes } from '../../common/web3Api';
import { updateCommunity } from '../../common/api/authApi';
import { GetAllLikes, GetCommunity, GetVerification } from '../../common/api/noAuthApi';
import { handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';
import { CommunityStatuses, CommunityTypes } from '../../constants/dropdownlist';
import { DEMO_AVATAR, InfuraAuth, InfuraLink } from '../../keys';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditIcon = styled.div`
  background: #333;
  border-radius: 25px;
  margin-top: -30px;
  padding: 8px;
  cursor: pointer;
  position: absolute;
  right: 12px;
`

const CommunityDetailPage = ({ communityId, community }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [trigger, setTrigger] = useState(0)
  const [editBaseImg, setEditBaseImg] = useState(null)
  const [editFile, setEditFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTitleContent, setIsTitleContent] = useState(true)
  const [isTitleDescription, setIsTitleDescription] = useState(true)
  const [isTitleDetails, setIsTitleDetails] = useState(true)
  const [editable, setEditable] = useState(false)
  const [isModalContent, setIsModalContent] = useState(null)
  const [isRemoveModal, setIsRemoveModal] = useState(false)
  const [editData, setEditData] = useState()
  const [gatedEditData, setGatedEditData] = useState({
    file: null,
    baseFile: null,
    gateType: null,
    gateStatus: null,
    gateBrand: null,
    gateCollection: null,
    title: null,
    description: null,
    image: null,
    addedContent: null,
    startDate: null,
  })
  const [verificationData, setVerificationData] = useState(null)
  const [communityLikes, setCommunityLikes] = useState([])

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })
  const likedByMe = useMemo(() => communityLikes.find(item => item?.likerId === user?.account), [communityLikes, user])

  useEffect(() => {
    setGatedEditData({
      file: null,
      baseFile: null,
      gateType: community?.type,
      gateStatus: community?.status,
      gateBrand: community?.brand,
      gateCollection: community?.collection,
      title: community?.title,
      description: community?.description,
      image: community?.img,
      addedContent: JSON.parse(community?.contents || '[]'),
      startDate: community?.date
    })
  }, [community])

  useEffect(() => {
    const loadData = async () => {
      const response = await GetVerification({ verifier: user?.account, tokenURI: communityId })
      response && setVerificationData(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user, communityId])
  
  useEffect(() => {
    const loadData = async () => {
      const response = await GetAllLikes({ communityId })
      response && setCommunityLikes(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user, trigger, communityId])

  const onClose = () => {
    setIsModalContent(false)
  }

  const onSaveGated = async () => {
    const { title, description, gateStatus, gateType, startDate, addedContent, image } = gatedEditData;

    if ((!title) || (!description) || (addedContent.length === 0)) {
      const note = UtilService.validateGatedEdit(title, description, addedContent)
      dispatch(addNotification(note, 'error'))
      return false
    }

    setIsLoading(true)
    let editImage = image
    if (editFile) {
      const result = await ipfs.add(editFile)
      editImage = 'ipfs://' + result.path
    }

    await updateCommunity({
      _id: communityId,
      title,
      description,
      status: gateStatus,
      type: gateType,
      date: startDate,
      contents: JSON.stringify(addedContent),
      img: editImage,
    })
    setIsLoading(false)

    setTrigger(trigger + 1)
    setEditable(false)
    dispatch(addNotification('Update successful', 'success'))
  }

  const onCloseGated = () => {
    setEditable(false)
    setEditBaseImg(null)
    setEditFile(null)
  }

  const onChangeFile = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await UtilService.convertBase64(file)
      setEditBaseImg(base64)
      setEditFile(file)
    }
  };

  const onLikeCommunity = async () => {
    const request = { communityId, type: 'community', likerId: user?.account, router }
    await dispatch(onLikes(request, () => setTrigger(trigger + 1)))
  }

  return (
    <LayoutPage>
      {isLoading && <BlackLoading/>}

      <div className='d-flex align-items-center justify-content-center'>
        <div className='m-3 container'>
          <div className='mt-5 row'>
            <div className='col-md-5 text-center position-relative' style={{ padding: 18 }}>
              {verificationData &&
                <picture>
                  <img
                    src={'../img/approval.png'}
                    alt='lazy'
                    className='bg-white position-absolute'
                    style={{ width: 70, right: 0, top: -15, borderRadius: 35 }}
                  />
                </picture>
              }

              <picture>
                <img src={UtilService.ConvertImg(editBaseImg || community?.img)} alt=''
                     style={{ height: 'auto', maxWidth: '100%' }}/>
              </picture>

              {editable &&
                <EditIcon>
                  <picture>
                    <img
                      src={'/img/icons/pencil.png'}
                      alt=''
                      style={{ width: 25 }}
                      onClick={() => document.getElementById('file').click()}
                    />
                  </picture>
                  <input type='file' id='file' className='d-none' onChange={onChangeFile}/>
                </EditIcon>
              }

              <div className='offer-title' onClick={() => setIsTitleDescription(!isTitleDescription)}>
                <div><span aria-hidden='true' className='icon_menu'/>&nbsp;&nbsp;Detail</div>
                <span aria-hidden='true' className={`arrow_carrot-${!isTitleDescription ? 'down' : 'up'} fs-24`}/>
              </div>

              {isTitleDescription &&
                <div className='offer-body'>
                  {!editable ?
                    <div>{community?.title}</div>
                    :
                    <input
                      className='form-control'
                      placeholder='title'
                      value={gatedEditData.title}
                      onChange={e => setGatedEditData({ ...gatedEditData, title: e.target.value })}
                    />
                  }

                  <div className='w-100 mt-2 text-start'>
                    {!editable && community?.description}
                    {editable &&
                      <ReactQuill
                        className='w-100 text-white'
                        style={{ minHeight: '150px' }}
                        value={gatedEditData.description}
                        onChange={e => setGatedEditData({ ...gatedEditData, description: e })}
                      />
                    }
                  </div>
                </div>
              }

              <div className='offer-title' onClick={() => setIsTitleDetails(!isTitleDetails)}>
                <div><span aria-hidden='true' className='icon_building'/>&nbsp;&nbsp;Status</div>
                <span aria-hidden='true' className={`arrow_carrot-${!isTitleDetails ? 'down' : 'up'} fs-24`}/>
              </div>

              {isTitleDetails && <div className='offer-body'>
                <div className='w-100 mt-2 d-flex flex-row justify-content-between'>
                  <div>Status</div>
                  <div>
                    {!editable ? community?.status :
                      <CustomDropDown
                        LIST={CommunityStatuses}
                        data={gatedEditData.gateStatus}
                        onChangeData={x => setGatedEditData({ ...gatedEditData, gateStatus: x })}
                      />}
                  </div>
                </div>
                <div className='w-100 mt-2 d-flex flex-row justify-content-between'>
                  <div>Type</div>
                  <div>
                    {!editable ?
                      community?.type
                      :
                      <CustomDropDown
                        LIST={CommunityTypes}
                        data={gatedEditData.gateType}
                        onChangeData={x => setGatedEditData({ ...gatedEditData, gateType: x })}
                      />
                    }
                  </div>
                </div>
                <div className='w-100 mt-2 d-flex flex-row justify-content-between'>
                  <div>Date</div>
                  <div>{!editable ? moment(community?.date).format('L, LT') : <DatePicker
                    selected={gatedEditData.startDate}
                    onChange={(x) => setGatedEditData({ ...gatedEditData, startDate: x })}
                    placeholderText='Please select the date!'
                  />}</div>
                </div>
              </div>}
            </div>

            <div className='col-md-7'>
              <div className='item_info p-10 position-relative'>
                {community?.creatorId === user?.account && community &&
                  <>
                    {editable ?
                      <div className='position-absolute' style={{ right: 12 }}>
                        <div className='btn btn-primary cursor-pointer' style={{ marginLeft: 12 }} onClick={onSaveGated}>
                          Save
                        </div>
                        <div className='btn btn-secondary cursor-pointer' style={{ marginLeft: 12 }}
                             onClick={onCloseGated}>
                          Cancel
                        </div>
                      </div>
                      :
                      <picture>
                        <img
                          src={'/img/icons/pencil.png'}
                          alt=''
                          className='position-absolute cursor-pointer'
                          style={{ right: 12, width: 40 }}
                          onClick={() => setEditable(true)}
                        />
                      </picture>
                    }
                  </>}

                <h2 className='color-b'>{community?.title || 'MetaSalt Token'}</h2>

                <div className='color-b d-flex flex-row align-items-center'>
                  Created by &nbsp;
                  <span className='cursor-pointer' style={{ color: '#2082e1' }}
                        onClick={() => handleRoute(router, `/sales/${community?.creator?.account}`)}>
                    {community?.creator?.username}
                  </span>
                  <div onClick={onLikeCommunity} className='ml-5 cursor-pointer'>
                    <span
                      className="icon_heart"
                      style={{ marginRight: 12, color: likedByMe ? '#ff343f' : '#666' }}
                      aria-hidden="true"
                    />
                    {communityLikes?.length || 0} favorites
                  </div>
                </div>

                <div className='mt-3 br-8 color-b d-flex flex-row' style={{ background: '#171a1b', border: '1px solid #222' }}>
                  {community?.brand &&
                    <div className='ml-10 mb-10 f-1 d-flex flex-row'>
                      <picture>
                        <img
                          className='width-50 height-50 br-50 object-cover mt-2 cursor-pointer'
                          src={UtilService.ConvertImg(community?.brand?.avatar) || DEMO_AVATAR}
                          alt='avatar'
                          onClick={() => handleRoute(router, `/brands/${community?.brand?._id}`)}
                        />
                      </picture>
                      <div style={{ marginLeft: 10 }}>
                        <div className='mt-16 fw-semibold'>Brand</div>
                        <div style={{ fontSize: 12 }}>{community?.brand?.title}</div>
                      </div>
                    </div>
                  }

                  <div className='ml-10 mb-10 f-1 d-flex flex-row'>
                    <picture>
                      <img
                        className='width-50 height-50 br-50 object-cover mt-2 cursor-pointer'
                        src={UtilService.ConvertImg(community?.Collection?.avatar) || DEMO_AVATAR}
                        alt='avatar'
                        onClick={() => handleRoute(router, `/subCollection/${community?.Collection?._id}`)}
                      />
                    </picture>
                    <div style={{ marginLeft: 10 }}>
                      <div className='mt-16 fw-semibold'>Collection</div>
                      <div style={{ fontSize: 12 }}>{community?.Collection?.title}</div>
                    </div>
                  </div>
                </div>

                <div className='offer-title' onClick={() => setIsTitleContent(!isTitleContent)}>
                  <div><span aria-hidden='true' className='icon_tag_alt' />&nbsp;&nbsp;Contents</div>
                  <span aria-hidden='true' className={`arrow_carrot-${!isTitleContent ? 'down' : 'up'} fs-24`} />
                </div>

                {isTitleContent && <div className='offer-body'>
                  <div className='w-100'>

                    {editable && <button
                      className='btn btn-primary'
                      onClick={() => {
                        setIsModalContent(true);
                        setEditData(null);
                      }}
                    >
                      + Add Content
                    </button>}

                    <NFTCommunity
                      content={gatedEditData?.addedContent}
                      editable={editable}
                      onEdit={(e) => {
                        setEditData(e);
                        setIsModalContent(true)
                      }}
                      onRemove={(e) => {
                        setGatedEditData({
                          ...gatedEditData,
                          addedContent: gatedEditData?.addedContent.filter((x, k) => k !== e)
                        })
                      }}
                    />
                  </div>

                </div>}
              </div>

              {community && community?.creatorId === user?.account &&
                <button className='mt-2 ml-2 btn btn-danger' onClick={() => setIsRemoveModal(true)}>
                  Remove Community
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      {isRemoveModal &&
        <ModalDeleteCommunity
          communityId={communityId}
          onSuccess={() => {}}
          onClose={() => setIsRemoveModal(false)}
        />
      }

      {isModalContent &&
        <ModalAddContent
          editData={editData}
          addedContent={gatedEditData.addedContent}
          onSave={e => setGatedEditData({ ...gatedEditData, addedContent: e })}
          onClose={onClose}
        />
      }
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ res, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const { communityId } = query;

  const response = await GetCommunity({ _id: communityId })

  return {
    props: {
      communityId,
      community: response || null,
    }
  }
}

export default CommunityDetailPage;
