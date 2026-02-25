import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import GatedNFTDisplayNew from '../../../components/cards/GatedNFTDisplayNew';
import ModalAddNFTCommunity from '../../../components/modals/modalAddNFTCommunity';
import CustomModal from '../../../components/custom/customModal';
import CustomPopover from '../../../components/custom/CustomPopover';
import { Loading } from '../../../components/loading';
import { GetDiscourse } from '../../../common/api/noAuthApi';
import { deleteDiscourse, updateDiscourse } from '../../../common/api/authApi';
import { handleRoute } from '../../../common/function';
import UtilService from '../../../sip/utilService';
import { Title } from '../../../constants/globalCss'
import { DEMO_DEFAULT_AVATAR, InfuraAuth, InfuraLink, PROFILE_BG, } from '../../../keys';

const EditDiscoursePage = ({ discourse }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState('')
  const [baseFile, setBaseFile] = useState('')
  const [bannerModal, setBannerModal] = useState(false)
  const [removeModal, setRemoveModal] = useState(false)
  const [addedNFT, setAddedNFT] = useState([])
  const [isModalNFT, setIsModalNFT] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCongrat, setIsCongrat] = useState(false)
  const btnRef = useRef()

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  useEffect(() => {
    if (discourse) {
      setTitle(discourse?.title)
      setDescription(discourse?.description)
      setBaseFile(UtilService.ConvertImg(discourse?.thumbnail || DEMO_DEFAULT_AVATAR))
      discourse?.addedNFT && setAddedNFT(JSON.parse(discourse?.addedNFT))
    }
  }, [discourse])

  const onChangeFile = async (e) => {
    const uploadFile = e.target.files[0]
    if (uploadFile) {
      const base64 = await UtilService.convertBase64(uploadFile)
      setBaseFile(base64)
      setFile(uploadFile)
    }
  };

  const onUpdateServer = async () => {
    setIsLoading(true)
    let image;
    if (file) {
      const result = await ipfs.add(file);
      image = 'ipfs://' + result.path;
    }

    const response = await updateDiscourse({
      _id: discourse?._id,
      title,
      description,
      thumbnail: image,
      addedNFT: JSON.stringify(addedNFT),
    })
    setIsLoading(false)

    if (response?.success) {
      dispatch(addNotification(response.message, 'success'))
      setIsCongrat(true)
      setTimeout(() => router.back(), 2000)
    } else {
      dispatch(addNotification('Sorry! Failed to update the server. Try again', 'error'))
    }
  }

  const onRemoveBanner = async () => {
    setFile(null)
    setBaseFile(null)
    setBannerModal(false)
  }

  const onCancel = () => {
    setTitle('')
    setDescription('')
    setFile(null)
    setBaseFile(null)
  }

  const onRemoveDiscourse = async () => {
    setRemoveModal(false)
    setIsLoading(true)
    const response = await deleteDiscourse({ _id: discourse?._id })
    setIsLoading(false)
    if (response?.success) {
      dispatch(addNotification(response?.message, 'success'))
      handleRoute(router, '/')
    } else {
      dispatch(addNotification('Can\'t remove this Discourse!', 'error'))
    }
  }

  return (
    <LayoutPage container congrat={isCongrat}>
      {isLoading && <Loading />}
      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Update Discourse Server</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Discourse Server Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Discourse Server Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-30" />

                <div className="d-row">
                  <div className="width-100 offer-btn buy-btn" onClick={onUpdateServer}>Save</div>
                  <div className="width-100 ml-4 offer-btn color-b" onClick={() => onCancel()}>Cancel</div>
                  <div className="width-100 ml-4 offer-btn color-b bg-red" onClick={() => setRemoveModal(true)}>Remove</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-4 col-sm-6 col-xs-12">
            <h5 className="color-b text-center">Discord Banner </h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse position-relative'>
                <div id="get_file">
                  {(baseFile || file) &&
                    <picture>
                      <img className='profile-banner' id="get_file" src={baseFile || file} alt='avatar' />
                    </picture>
                  }
                  {!(baseFile || file) &&
                    <div
                      className='profile-banner'
                      style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                    />
                  }
                  <br/>
                  <input ref={btnRef} type="file" id='upload_file' className="cursor-pointer" onChange={onChangeFile} />
                </div>
              </div>

              <div className="center-div">
                <CustomPopover content="Suggested Size is 680 * 90" placement="bottom">
                  <div className="ml-2 btn-main btn-icon cursor-pointer" onClick={() => btnRef.current?.click()}>
                    <span aria-hidden="true" className="icon_pencil" />
                  </div>
                </CustomPopover>

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

      {removeModal &&
        <CustomModal
          title={'Remove Discourse'}
          description={'Are you sure about removing the Discourse?'}
          onApprove={onRemoveDiscourse}
          onClose={() => setRemoveModal(false)}
        />
      }

      {isModalNFT && <ModalAddNFTCommunity addedNFT={addedNFT} setAddedNFT={setAddedNFT} onClose={() => setIsModalNFT(false)} />}
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ query }) => {

  const { id } = query

  const response = await GetDiscourse({ _id: id })

  return {
    props: {
      discourse: response || null,
    }
  }
}

export default EditDiscoursePage;
