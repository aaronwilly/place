import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import ModalDeleteRoom from '../../../components/modals/modalDeleteRoom';
import { TinyLoading } from '../../../components/loading';
import { useWeb3Auth } from '../../../services/web3auth';
import { getLiveStream, updateLiveStream } from '../../../common/api/authApi';
import { LiveStreamTypes } from '../../../common/constant';
import UtilService from '../../../sip/utilService';
import { Title } from '../../../constants/globalCss';
import { DropdownStyles } from '../../../constants/dropdownlist';
import { InfuraAuth, InfuraLink, PROFILE_BG } from '../../../keys';

const RoomEditPage = ({ roomId, livestream }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, login } = useWeb3Auth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [roomImage, setRoomImage] = useState('')
  const [remoteRoomImage, setRemoteRoomImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRemoveModal, setIsRemoveModal] = useState(false)
  const roomImageInput = useRef()

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  useEffect(() => {
    if (livestream) {
      setName(livestream?.name)
      setDescription(livestream?.description)
      setType(livestream?.type)
      setRemoteRoomImage(livestream?.image)
    }
  }, [livestream])

  const uploadRoomImage = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await UtilService.convertBase64(file)
      setRoomImage(base64)
      const result = await ipfs.add(file);
      setRemoteRoomImage('ipfs://' + result.path);
    }
  }

  const removeRoomImage = async () => {
    setRoomImage('')
    setRemoteRoomImage('')
  }

  const onTypeSelect = e => setType(e.value)

  const onEditRoom = async () => {
    if (!isAuthenticated) {
      await login()
      return false
    }

    if (!name || !description) {
      const param = !name ? 'Name' : 'Description'
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false
    }

    setIsLoading(true)
    const response = await updateLiveStream({
      roomId,
      name,
      description,
      type,
      image: remoteRoomImage,
    })
    setIsLoading(false)

    if (response?.success) {
      dispatch(addNotification(response?.message, 'success'))
      router.back()
    }
  }

  return (
    <LayoutPage container>
      <section>
        <div className='row'>
          <div className='col-lg-6 offset-lg-1 col-sm-12 mb-5'>
            <form id='form-create-item' className='form-border' action='#'>
              <div className='field-set'>
                <Title left>Edit LiveStream Room</Title>

                <div className='spacer-single' />

                <h5 className='color-b'>Name</h5>
                <input
                  className='form-control mb-0'
                  placeholder='Enter Name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <div className='spacer-30' />

                <h5 className='color-b'>Description</h5>
                <textarea
                  className='form-control'
                  placeholder='Tell the world your story!'
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <h5 className='color-b'>Type</h5>
                <Select
                  value = {
                    LiveStreamTypes.filter(option =>
                      option.value === type)
                  }
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 998 }}
                  options={LiveStreamTypes}
                  onChange={onTypeSelect}
                />

                <div className='spacer-20' />

                <div className='d-row'>
                  {!isLoading ?
                    <div className='offer-btn buy-btn' onClick={onEditRoom} style={{ width: 100 }}>
                      Update
                    </div>
                    :
                    <TinyLoading />
                  }
                  <div className='offer-btn buy-btn' onClick={() => setIsRemoveModal(true)} style={{ width: 100 }}>
                    Delete
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className='col-lg-5 col-sm-12'>
            <h5 className='text-center mt-50 color-b'>LiveStream Room Image (Optional)</h5>

            <div className='d-flex flex-column align-items-center'>
              {roomImage || remoteRoomImage ?
                <picture>
                  <img
                    src={roomImage || UtilService.ConvertImg(remoteRoomImage)}
                    alt='avatar'
                    className='liveStream-room-image'
                  />
                </picture>
                :
                <div
                  className='mt-5 profile-banner'
                  style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                />
              }
              <input type='file' ref={roomImageInput} onChange={uploadRoomImage} hidden={true} />
            </div>

            <div className='mt-4 d-flex align-items-center justify-content-center'>
              <div className='btn-main btn-icon cursor-pointer' onClick={() => roomImageInput.current?.click()}>
                <span aria-hidden='true' className='icon_pencil' />
              </div>
              {!(!roomImage && !remoteRoomImage) &&
                <div className='ms-3 btn-danger btn-icon cursor-pointer' onClick={() => removeRoomImage()}>
                  <span aria-hidden='true' className='icon_trash' />
                </div>
              }
            </div>

          </div>
        </div>

        {isRemoveModal && <ModalDeleteRoom isOpen={isRemoveModal} onClose={() => setIsRemoveModal(false)} />}
      </section>
    </LayoutPage>
  )
}

export const getServerSideProps = async ({ res, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const { roomId } = query

  const response = await getLiveStream({ roomId })

  return {
    props: {
      roomId,
      livestream: response || null,
    }
  }
}

export default RoomEditPage
