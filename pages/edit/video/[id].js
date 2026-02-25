import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import { TinyLoading } from '../../../components/loading';
import GatedNFTDisplayNew from '../../../components/cards/GatedNFTDisplayNew';
import ModalAddNFTCommunity from '../../../components/modals/modalAddNFTCommunity';
import CustomDisplayVideo from '../../../components/custom/CustomDisplayVideo';
import UtilService from '../../../sip/utilService';
import { getVideo, updateVideo } from '../../../common/api/authApi';
import { CATEGORIES_COLLECTIONS } from '../../../constants/hotCollections';
import { DropdownStyles } from '../../../constants/dropdownlist';
import { Title } from '../../../constants/globalCss'

const EditVideoPage = ({ video }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(null)
  const [file, setFile] = useState('')
  const [baseFile, setBaseFile] = useState('')
  const [addedNFT, setAddedNFT] = useState([])
  const [isModalNFT, setIsModalNFT] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCongrat, setIsCongrat] = useState(false)

  useEffect(() => {
    if (video) {
      setTitle(video?.title);
      setDescription(video?.description);
      const filterCategory = CATEGORIES_COLLECTIONS.find(item => item.value === video?.category);
      setCategory({ value: video?.category, label: filterCategory?.label });
      setAddedNFT(JSON.parse(video?.addedNFT));      
    }
  }, [video])

  const onChangeFile = async (e) => {
    const uploadFile = e.target.files[0]
    if (uploadFile) {
      const base64 = await UtilService.convertBase64(uploadFile);
      setBaseFile(base64)
      setFile(uploadFile)
    }
  };

  const onUpdateVideo = async () => {

    if (!title || !description || !category) {
      const param = !title ? 'Title' : !description ? 'Description' : 'Category';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    setIsLoading(true)
    const response = await updateVideo({
      _id: video?._id,
      title,
      description,
      category: category?.value,
      addedNFT,
    })
    setIsLoading(false)

    if (response?.success) {
      dispatch(addNotification(response?.message, 'success'))
      setIsCongrat(true);
      setTimeout(() => router.back(), 2000)
    } else {
      dispatch(addNotification('Sorry! Failed to update the server. Try again', 'error'))
    }
  }

  const handleCategory = (e) => {
    setCategory({ value: e.value, label: e.label });
  }

  const onCancel = () => {
    setTitle('')
    setDescription('')
    setFile('')
    setBaseFile(null)
  }

  return (
    <LayoutPage container congrat={isCongrat}>

      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Update The Video</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Video Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Video Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Category</h5>
                <Select
                  value={category}
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 999 }}
                  options={[...CATEGORIES_COLLECTIONS]}
                  onChange={handleCategory}
                />

                <div className="spacer-30" />

                <div className="d-flex flex-row">
                  {!isLoading ?
                    <div className="width-100 offer-btn buy-btn" onClick={onUpdateVideo}>Save</div>
                    :
                    <TinyLoading />
                  }

                  <div className="width-100 ml-4 offer-btn color-b" onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-4 col-sm-12 col-xs-12">
            {title && <CustomDisplayVideo video={video} visibleOnly />}

            {baseFile &&
              <div className='d-flex align-items-center justify-content-center'>
                <div className="my-3 mx-auto d-flex align-items-center justify-content-center">
                  <div className="btn-main" onClick={() => document.getElementById('file').click()}>
                    <input type="file" id="file" className='d-none' onChange={onChangeFile} />
                    <span aria-hidden="true" className="icon_pencil" />
                  </div>
                </div>
              </div>
            }

            <div className='spacer-single' />

            <GatedNFTDisplayNew editable data={addedNFT} setAddedNFT={setAddedNFT} />

            <div className='d-flex align-items-center justify-content-center'>
              <div className="mt-2 btn-main btn-icon cursor-pointer" onClick={() => setIsModalNFT(true)}>
                <span aria-hidden="true" className="icon_pencil" />
              </div>
            </div>

            <br />
          </div>
        </div>
      </section>

      {isModalNFT &&
        <ModalAddNFTCommunity addedNFT={addedNFT} setAddedNFT={setAddedNFT} onClose={() => setIsModalNFT(false)} />
      }
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ query }) => {

  const { id } = query

  const response = await getVideo({ _id: id })

  return {
    props: {
      video: response || null,
    }
  }
}

export default EditVideoPage;
