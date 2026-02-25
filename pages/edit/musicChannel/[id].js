import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import CustomModal from '../../../components/custom/customModal';
import { TinyLoading } from '../../../components/loading';
import { getMusicChannel, updateMusicChannel } from '../../../common/api/authApi';
import UtilService from '../../../sip/utilService';
import { Title } from '../../../constants/globalCss'
import { DropdownStyles } from '../../../constants/dropdownlist';
import { CATEGORIES_COLLECTIONS } from '../../../constants/hotCollections';
import { DEMO_AVATAR, InfuraAuth, InfuraLink, PROFILE_BG } from '../../../keys';

const EditMusicPage = ({ musicChannel }) => {

  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(null)
  const [file1, setFile1] = useState('')
  const [baseFile1, setBaseFile1] = useState('')
  const [imgModal, setImgModal] = useState(false)
  const [file2, setFile2] = useState('')
  const [baseFile2, setBaseFile2] = useState('')
  const [bannerModal, setBannerModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const btnRef1 = useRef()
  const btnRef2 = useRef()

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  useEffect(() => {
    if (musicChannel) {
      setTitle(musicChannel?.title)
      setDescription(musicChannel?.description)
      const filterCategory = CATEGORIES_COLLECTIONS.find(item => item.value === musicChannel?.category)
      setCategory({ value: musicChannel?.category, label: filterCategory.label })
      setFile1(musicChannel?.avatar)
      setFile2(musicChannel?.banner)
    }
  }, [musicChannel])

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

  const onUpdateBrand = async () => {

    if (!title || !description || !category) {
      const param = !title ? 'Title' : !description ? 'Description' : 'Category';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    setIsLoading(true)
    const response = await updateMusicChannel({
      _id: musicChannel?._id,
      title,
      description,
      category: category?.value,
      avatar: file1,
      banner: file2,
    })
    setIsLoading(false)

    if (response?.success) {
      dispatch(addNotification(response?.message, 'success'))
    } else {
      dispatch(addNotification('Sorry! Failed to update the music. Try again', 'error'))
    }
  }

  const onRemoveProfile = async () => {
    setFile1(null);
    setBaseFile1(null);
    setImgModal(false)
  }

  const onRemoveBanner = async () => {
    setFile2(null);
    setBaseFile2(null);
    setBannerModal(false)
  }

  const handleCategory = (e) => {
    setCategory({ value: e.value, label: e.label });
  }

  const onCancel = () => {
  }

  return (
    <LayoutPage container>
      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Edit Music</Title>

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
                  value={category}
                />

                <div className="spacer-30" />

                <div className="d-flex flex-row">
                  {!isLoading ?
                    <div className="width-100 offer-btn buy-btn" onClick={onUpdateBrand}>Save</div>
                    :
                    <TinyLoading />
                  }

                  <div className="w-100 ml-4 offer-btn color-b" onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5 className="mt-50 color-b text-center">Music Community Image (Optional)</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>

              <div className='browse'>
                <picture>
                  <img
                    src={baseFile1 || UtilService.ConvertImg(file1) || DEMO_AVATAR}
                    alt='avatar'
                    id="get_file"
                    className='mt-0 profile-avatar'
                  />
                </picture>
                <br />
                <input ref={btnRef1} type="file" multiple id='upload_file' className="cursor-pointer" onChange={onChangeFile1} />
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
                      <img
                        id="get_file"
                        className='profile-banner'
                        src={baseFile2 || UtilService.ConvertImg(file2)}
                        alt='avatar'
                      />
                    </picture>
                  }
                  {!(baseFile2 || file2) &&
                    <div
                      className='profile-banner'
                      style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                    />
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
            <br />
          </div>
        </div>
      </section>

      <br />

      {imgModal &&
        <CustomModal
          title={'Remove Avatar'}
          description={'Are you sure about removing the Avatar?'}
          onApprove={onRemoveProfile}
          onClose={() => setImgModal(false)}
        />
      }

      {bannerModal &&
        <CustomModal
          title={'Remove Banner'}
          description={'Are you sure about removing the Banner?'}
          onApprove={onRemoveBanner}
          onClose={() => setBannerModal(false)}
        />
      }
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ query }) => {

  const { id } = query

  const response = await getMusicChannel({ _id: id })

  return {
    props: {
      musicChannel: response || null,
    }
  }
}

export default EditMusicPage;
