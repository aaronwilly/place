import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import GatedNFTDisplayNew from '../../components/cards/GatedNFTDisplayNew';
import ModalAddNFTCommunity from '../../components/modals/modalAddNFTCommunity';
import { TinyLoading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import { createLiveStream, createRoom, getManagementToken } from '../../common/api/authApi';
import { LiveStreamTemplateId, LiveStreamTypes } from '../../common/constant';
import UtilService from '../../sip/utilService';
import { Title } from '../../constants/globalCss';
import { DropdownStyles } from '../../constants/dropdownlist';
import { InfuraAuth, InfuraLink, PROFILE_BG } from '../../keys';

const CreateLiveStream = ({ managementToken }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, login } = useWeb3Auth()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [roomImage, setRoomImage] = useState('')
  const [remoteRoomImage, setRemoteRoomImage] = useState('')
  const [addedNFT, setAddedNFT] = useState([])
  const [isModalNFT, setIsModalNFT] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const roomImageInput = useRef()

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const uploadRoomImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      setRoomImage(base64);
      const result = await ipfs.add(file);
      setRemoteRoomImage('ipfs://' + result.path);
    }
  };

  const removeRoomImage = async () => {
    setRoomImage(null)
    setRemoteRoomImage(null)
  }

  const onTypeSelect = (e) => {
    setType(e.value)
  }

  const onCreateRoom = async () => {

    if (!isAuthenticated) {
      await login()
      return false
    }

    if (!name || !description) {
      const param = !name ? 'Name' : 'Description';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    setIsLoading(true)

    const response = await createRoom(managementToken, {
      name: `new-room-${uuidv4()}`,
      description,
      template_id: LiveStreamTemplateId,
      region: 'us',
    })
    if (response) {
      dispatch(addNotification('Create successful', 'success'))
      await createLiveStream({
        roomId: response.id,
        name,
        description,
        type,
        image: remoteRoomImage || '',
        addedNFT: JSON.stringify(addedNFT),
        creatorId: user?.account,
      })
      setIsLoading(false)
      router.back()
    } else {
      dispatch(addNotification('Only accepted characters are a-z, A-Z, 0-9, and . - : _', 'error'))
      setIsLoading(false)
    }
  }

  return (
    <LayoutPage container>
      <section>
        <div className='row'>
          <div className='col-lg-6 offset-lg-1 col-sm-12 mb-5'>
            <form id='form-create-item' className='form-border' action='#'>
              <div className='field-set'>
                <Title left>Create LiveStream Room</Title>

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
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 998 }}
                  options={LiveStreamTypes}
                  onChange={onTypeSelect}
                />

                <div className='spacer-20' />

                <div className='d-flex flex-row'>
                  {!isLoading ?
                    <div className='width-100 offer-btn buy-btn' onClick={onCreateRoom}>Save</div>
                    :
                    <TinyLoading />
                  }
                </div>
              </div>
            </form>
          </div>

          <div className='col-lg-5 col-sm-12'>
            <h5 className='mt-50 color-b text-center'>LiveStream Room Image (Optional)</h5>

            <div className='d-flex flex-column align-items-center'>
              {roomImage || remoteRoomImage ?
                <picture>
                  <img className='liveStream-room-image' src={roomImage || remoteRoomImage} alt='avatar' />
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

            <div className='spacer-double' />

            <GatedNFTDisplayNew editable data={addedNFT} setAddedNFT={setAddedNFT} />

            <div className='d-flex align-items-center justify-content-center'>
              <div className="mt-2 btn-main btn-icon cursor-pointer" onClick={() => setIsModalNFT(true)}>
                <span aria-hidden="true" className="icon_pencil" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalNFT &&
        <ModalAddNFTCommunity addedNFT={addedNFT} setAddedNFT={setAddedNFT} onClose={() => setIsModalNFT(false)} />
      }
    </LayoutPage>
  )
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response = await getManagementToken()

  return {
    props: {
      managementToken: response || null,
    }
  }
}

export default CreateLiveStream;
