import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import CustomSlide from '../../components/custom/CustomSlide';
import CustomModal from '../../components/custom/customModal';
import { TinyLoading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import { createMusicChannel, getMusicChannels } from '../../common/api/authApi';
import UtilService from '../../sip/utilService';
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';
import { Title } from '../../constants/globalCss';
import { DropdownStyles } from '../../constants/dropdownlist';
import { DEMO_AVATAR, DEMO_BACKGROUND, InfuraAuth, InfuraLink, PROFILE_BG } from '../../keys';

const CreateMusicChannelPage = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, login } = useWeb3Auth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [file1, setFile1] = useState('')
  const [baseFile1, setBaseFile1] = useState('')
  const [file2, setFile2] = useState('')
  const [baseFile2, setBaseFile2] = useState('')
  const [imgModal, setImgModal] = useState(false)
  const [bannerModal, setBannerModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCongrat, setIsCongrat] = useState(false)
  const [data, setData] = useState([])
  const btnRef1 = useRef()
  const btnRef2 = useRef()

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  useEffect(() => {
    const loadData = async () => {
      const response = await getMusicChannels({ creatorId: user?.account })
      response && setData(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  const onChangeFile1 = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      setBaseFile1(base64);
      const result = await ipfs.add(file);
      setFile1('ipfs://' + result.path);
    }
  };

  const onChangeFile2 = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      setBaseFile2(base64);
      const result = await ipfs.add(file);
      setFile2('ipfs://' + result.path);
    }
  };

  const onSaveProfile = async () => {
    if (!isAuthenticated) {
      await login()
      return false
    }

    if (!title || !description || !category) {
      const param = !title ? 'Title' : !description ? 'Description' : 'Category';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    setIsLoading(true)
    const response = await createMusicChannel({
      title,
      description,
      category,
      avatar: file1,
      banner: file2,
      creatorId: user?.account,
    })
    setIsLoading(false)

    if (response?.success) {
      dispatch(addNotification(response?.message, 'success'))
      setIsCongrat(true)
      setTimeout(() => router.back(), 2000)      
    } else {
      dispatch(addNotification('Sorry! Failed to create new music community. Try again', 'error'))
    }
  }

  const onRemoveProfile = async () => {
    setFile1(null)
    setBaseFile1(null)
    setImgModal(false)
  }

  const onRemoveBanner = async () => {
    setFile2(null)
    setBaseFile2(null)
    setBannerModal(false)
  }

  const handleCategory = (e) => {
    setCategory(e.value)
  }

  const onCancel = () => {
    setTitle('')
    setDescription('')
    setCategory('')
    setFile1(null)
    setBaseFile1(null)
    setFile2(null)
    setBaseFile2(null)
    setImgModal(false)
    setBannerModal(false)
  }

  return (
    <LayoutPage container congrat={isCongrat}>
      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Create New Music Channel</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Enter Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Tell the world your story!"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Type</h5>
                <Select
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 999 }}
                  options={[...CATEGORIES_COLLECTIONS]}
                  onChange={handleCategory}
                />

                <div className="spacer-20" />

                <div className="d-flex flex-row">
                  {!isLoading ?
                    <div className="width-100 offer-btn buy-btn" onClick={onSaveProfile}>Save</div>
                    :
                    <TinyLoading />
                  }

                  <div className="width-100 ml-4 offer-btn color-b" onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5 className="mt-50 color-b text-center">Music Channel Image (Optional)</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse'>
                <picture>
                  <img src={baseFile1 || UtilService.ConvertImg(file1) || DEMO_AVATAR} alt='avatar' id="get_file" className='mt-0 profile-avatar' />
                </picture>
                <br/>
                <input multiple ref={btnRef1} type="file" id='upload_file' className="cursor-pointer" onChange={onChangeFile1} />
              </div>

              <div className="mt-20 center-div">
                <div className="ml-2 btn-main btn-icon cursor-pointer" onClick={() => btnRef1.current?.click()}>
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
                {!(!baseFile1 && !file1) &&
                  <div className="ml-2 btn-danger btn-icon cursor-pointer" onClick={() => setImgModal(true)}>
                    <span aria-hidden="true" className="icon_trash" />
                  </div>
                }
              </div>
            </div>

            <h5 className="text-center color-b">Music Banner (Optional)</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse position-relative'>
                <div id="get_file">
                  {(baseFile2 || file2) &&
                    <picture>
                      <img src={baseFile2 || UtilService.ConvertImg(file2)} alt='avatar' id="get_file" className='profile-banner' />
                    </picture>
                  }
                  {!(baseFile2 || file2) &&
                    <div className='profile-banner' style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
                  }
                  <br />
                  <input ref={btnRef2} type="file" id='upload_file' className="cursor-pointer" onChange={onChangeFile2} />
                </div>
              </div>

              <div className="center-div">
                <div className="ml-2 btn-main btn-icon cursor-pointer" onClick={() => btnRef2.current?.click()}>
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
                {!(!baseFile2 && !file2) &&
                  <div className="ml-2 btn-danger btn-icon cursor-pointer" onClick={() => setBannerModal(true)}>
                    <span aria-hidden="true" className="icon_trash" />
                  </div>
                }
              </div>
            </div>
            <br/>
          </div>
        </div>
      </section>

      {isAuthenticated && <h3 className="color-b text-center">My Music Channels</h3>}

      <div className='mt-30 d-flex flex-wrap justify-content-center'>
        {isAuthenticated && data?.map((item, index) => (
          <div key={index} className="mt-10">
            <CustomSlide
              index={index + 1}
              avatar={UtilService.ConvertImg(item?.avatar) || DEMO_AVATAR}
              banner={UtilService.ConvertImg(item?.banner) || DEMO_BACKGROUND}
              username={item?.title}
              uniqueId={item?.description}
              collectionId={item?._id}
              music={true}
            />
          </div>
        ))}
      </div>

      {imgModal &&
        <CustomModal
          title={'Remove Avatar'}
          description={'Are you sure about removing the Avatar?'}
          onClose={() => setImgModal(false)}
          onApprove={onRemoveProfile}
        />
      }

      {bannerModal &&
        <CustomModal
          title={'Remove Banner'}
          description={'Are you sure about removing the Banner?'}
          onClose={() => setBannerModal(false)}
          onApprove={onRemoveBanner}
        />
      }
    </LayoutPage>
  );
}

export default CreateMusicChannelPage;
