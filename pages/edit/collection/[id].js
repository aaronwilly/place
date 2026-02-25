import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import CustomModal from '../../../components/custom/customModal';
import CustomPopover from '../../../components/custom/CustomPopover';
import { TinyLoading } from '../../../components/loading';
import { useWeb3Auth } from '../../../services/web3auth';
import { getBrands, getCollection, updateCollection } from '../../../common/api/authApi';
import UtilService from '../../../sip/utilService';
import { Title } from '../../../constants/globalCss';
import { DEMO_DEFAULT_AVATAR, InfuraAuth, InfuraLink } from '../../../keys';

const EditCollectionPage = ({ collection }) => {

  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(null)
  const [file1, setFile1] = useState('')
  const [baseFile1, setBaseFile1] = useState('')
  const [file2, setFile2] = useState('')
  const [baseFile2, setBaseFile2] = useState('')
  const [imgModal, setImgModal] = useState(false)
  const [bannerModal, setBannerModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [myBrands, setMyBrands] = useState([])
  const btnRef1 = useRef()
  const btnRef2 = useRef()

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  useEffect(() => {
    const loadData = async () => {
      const response = await getBrands({ creatorId: user?.account })
      if (response) {
        const brands = response.map((item, index) => {
          return {
            ...item,
            id: index,
            value: item?._id,
            label: item?.title,
            icon: 'fa-image',
            title: item?.title,
            description: item?.description,
            banner: item?.banner,
          }
        })
        setMyBrands(brands)
      }
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  useEffect(() => {
    if (collection && myBrands.length) {
      setTitle(collection?.title)
      setDescription(collection?.description)
      const filterCategory = myBrands.find(item => item.value === collection?.brand)
      setCategory({ value: filterCategory?.value, label: filterCategory?.title })
      setFile1(collection?.avatar)
      setFile2(collection?.banner)
    }
  }, [collection, myBrands])

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
    let file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file)
      setBaseFile2(base64)
      const result = await ipfs.add(file)
      setFile2('ipfs://' + result.path)
    }
  };

  const onUpdateCollection = async () => {

    if (!title || !description || !category || !file1 || !file2) {
      const param = !title ? 'Title' : !description ? 'Description' : !category ? 'Brand' : !file1 ? 'Collection Image' : 'Collection Banner'
      dispatch(addNotification(`${param} is not optional.`, 'error'))
      return false
    }

    setIsLoading(true)
    const response = await updateCollection({
      _id: collection?._id,
      title,
      description,
      brandId: category?.value,
      avatar: file1,
      banner: file2,
    })
    setIsLoading(false)

    if (response?.success) {
      dispatch(addNotification(response?.message, 'success'))
    } else {
      dispatch(addNotification('Sorry! Failed to update the collection. Try again', 'error'))
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

  const handleBrand = async (e) => {
    setCategory({ value: e.value, label: e.label })
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
                <Title left>Edit Collection</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  value={title}
                  placeholder="Enter Title"
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  data-autoresize
                  className="form-control"
                  value={description}
                  placeholder="Tell the world your story!"
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-10" />

                <div className="d-flex flex-row align-items-center">
                  <h5 className="color-b">Brand</h5>
                  <Link href='/create/brand' prefetch={false}>
                    <input type="button" className="btn-main tiny-btn" value="New Brand" style={{ width: 85 }} />
                  </Link>
                </div>

                <div className='dropdownSelect one'>
                  <Select
                    styles={selectStyles}
                    menuContainerStyle={{ 'zIndex': 999 }}
                    options={[...myBrands]}
                    onChange={handleBrand}
                    value={category}
                  />
                </div>

                <div className="spacer-30" />

                <div className="d-flex flex-row">
                  {!isLoading ?
                    <div className="w-100 offer-btn buy-btn" onClick={onUpdateCollection}>Save</div>
                    :
                    <TinyLoading />
                  }

                  <div className="w-100 ml-4 offer-btn color-b" onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5 className="mt-50 color-b text-center">Collection Image</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse'>
                <picture>
                  <img
                    src={baseFile1 || UtilService.ConvertImg(file1) || DEMO_DEFAULT_AVATAR}
                    alt='avatar'
                    id="get_file"
                    className='mt-0 profile-avatar'
                  />
                </picture>
                <br/>
                <input id='upload_file' type="file" multiple onChange={onChangeFile1} className="cursor-pointer" ref={btnRef1} />
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

            <h5 className="text-center color-b">Collection Banner</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse position-relative'>
                <div id="get_file">
                  {(baseFile2 || file2) &&
                    <picture>
                      <img className='profile-banner' id="get_file" src={baseFile2 || UtilService.ConvertImg(file2)} alt='avatar' />
                    </picture>
                  }
                  {!(baseFile2 || file2) && <div className='profile-banner'/>}
                  <br/>
                  <input ref={btnRef2} type="file" className="cursor-pointer" id='upload_file' onChange={onChangeFile2} />
                </div>
              </div>

              <div className="center-div">
                <CustomPopover content="Suggested Size is 680 * 90" placement="bottom">
                  <div className="ml-2 btn-main btn-icon cursor-pointer" onClick={() => btnRef2.current?.click()}>
                    <span aria-hidden="true" className="icon_pencil" />
                  </div>
                </CustomPopover>

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
          onApprove={onRemoveBanner}
          onClose={() => setBannerModal(false)}
        />
      }
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ query }) => {

  const { id } = query

  const response = await getCollection({ _id: id })

  return {
    props: {
      collection: response || null,
    }
  }
}

export default EditCollectionPage;

const selectStyles = {
  option: (base, state) => ({
    ...base,
    background: '#303030',
    // color: "hsl(0, 0%, 50%)",
    color: '#fff',
    borderRadius: state.isFocused ? '0' : 0,
    '&:hover': { backgroundColor: '#8364E2', color: '#fff' }
  }),
  menu: base => ({ ...base, borderRadius: 0, marginTop: 0 }),
  menuList: base => ({ ...base, padding: 0 }),
  control: (base, state) => ({ ...base, padding: 2 })
};
