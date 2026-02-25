import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import CustomModal from '../../components/custom/customModal';
import GatedNFTDisplayNew from '../../components/cards/GatedNFTDisplayNew';
import ModalAddNFTCommunity from '../../components/modals/modalAddNFTCommunity';
import { TinyLoading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { createDiscourse } from '../../common/api/authApi';
import { Title } from '../../constants/globalCss';
import { InfuraAuth, InfuraLink, PROFILE_BG } from '../../keys';

const CreateDiscoursePage = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, login } = useWeb3Auth()
  const [file, setFile] = useState('')
  const [baseFile, setBaseFile] = useState('')
  const [bannerModal, setBannerModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCongrat, setIsCongrat] = useState(false)
  const [addedNFT, setAddedNFT] = useState([])
  const [isModalNFT, setIsModalNFT] = useState(false)
  const btnRef = useRef()

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const onChangeFile = async (e) => {
    const uploadFile = e.target.files[0];
    if (uploadFile) {
      const base64 = await UtilService.convertBase64(uploadFile);
      setBaseFile(base64)
      setFile(uploadFile);
    }
  };

  const onCreateServer = async () => {

    if (!isAuthenticated) {
      login()
      return false
    }
    if (!title || !description || !baseFile) {
      const param = !title ? 'Title' : !description ? 'Description' : 'Banner';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    const result = await ipfs.add(file)
    const image = 'ipfs://' + result.path

    setIsLoading(true)
    const response = await createDiscourse({
      title,
      description,
      thumbnail: image,
      addedNFT: JSON.stringify(addedNFT),
      creatorId: user?.account,
    })
    setIsLoading(false)
    
    if (response?.success) {
      dispatch(addNotification(response?.message, 'success'))
      setIsCongrat(true)
      setTimeout(() => router.back(), 2000)
    }
  }

  const onRemoveBanner = async () => {
    setFile(null)
    setBaseFile(null)
    setBannerModal(false)
  }

  const onCancel = () => {
    setFile('')
    setBaseFile('')
    setTitle('')
    setDescription('')
  }

  return (
    <LayoutPage container congrat={isCongrat}>

      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Create New Discourse Server</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Discord Server Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Discord Server Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-30" />

                <div className="d-row">
                  {!isLoading ?
                    <div className="width-100 offer-btn buy-btn" onClick={onCreateServer}>Save</div>
                    :
                    <TinyLoading />
                  }

                  <div className="width-100 ml-4 offer-btn color-b" onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-4 col-sm-6 col-xs-12">

            <h5 className="text-center color-b">Discord Banner </h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse position-relative'>
                <div id="get_file">
                  {(baseFile || file) &&
                    <picture>
                      <img className='profile-banner' id="get_file" src={baseFile || file} alt='avatar' />
                    </picture>
                  }
                  {!(baseFile || file) &&
                    <div className='profile-banner' style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
                  }
                  <br />
                  <input id='upload_file' type="file" onChange={onChangeFile} className="cursor-pointer" ref={btnRef} />
                </div>
              </div>

              <div className="center-div">
                <div className="ml-2 btn-main btn-icon cursor-pointer" onClick={() => btnRef.current.click()}>
                  <span aria-hidden="true" className="icon_pencil" />
                </div>

                {!(!baseFile && !file) &&
                  <div className="ml-2 btn-danger btn-icon cursor-pointer" onClick={() => setBannerModal(true)}>
                    <span aria-hidden="true" className="icon_trash" />
                  </div>
                }
              </div>
            </div>

            <GatedNFTDisplayNew editable data={addedNFT} setAddedNFT={setAddedNFT} />

            <div className='d-flex align-items-center justify-content-center'>
              <div className="mt-2 btn-main btn-icon cursor-pointer" onClick={() => setIsModalNFT(true)}>
                <span aria-hidden="true" className="icon_pencil" />
              </div>
            </div>

            <br/>
          </div>
        </div>
      </section>

      {bannerModal &&
        <CustomModal
          title={'Remove Banner'}
          description={'Are you sure about removing the Banner?'}
          onApprove={onRemoveBanner}
          onClose={() => setBannerModal(false)}
        />
      }

      {isModalNFT &&
        <ModalAddNFTCommunity addedNFT={addedNFT} setAddedNFT={setAddedNFT} onClose={() => setIsModalNFT(false)} />
      }
    </LayoutPage>
  );
}

export default CreateDiscoursePage;
