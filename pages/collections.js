import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import CustomSlide from '../components/custom/CustomSlide';
import ModalDeleteCollection from '../components/modals/modalDeleteCollection';
import { useWeb3Auth } from '../services/web3auth';
import { getCollections } from '../common/api/authApi';
import { handleRoute } from '../common/function';
import UtilService from '../sip/utilService';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../keys';

const Collections = () => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [trigger, setTrigger] = useState(1);
  const [modalDelIndex, setModalDelIndex] = useState(-1);
  const [data, setData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const response = await getCollections({ creatorId: user?.account })
      response && setData(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  const onDelCollection = (e) => setModalDelIndex(e)

  return (
    <LayoutPage>
      <LayoutScreen
        title='My Collections'
        description='Create, curate, and manage collections of unique NFTs to share and sell.'
      >
        <div className='container'>
          <div className='row m-10-hor'>
            <div className='col-12 text-center'>
              <div className='mt-30 d-flex align-items-center justify-content-center'>
                <div className="btn-main" onClick={() => handleRoute(router, '/create/collection')}>Create a collection</div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-30 d-flex flex-wrap align-items-center justify-content-center' style={{ minHeight: 333 }}>
          {data?.map((item, index) => (
            <div key={index} className="mt-10">
              <CustomSlide
                index={index + 1}
                avatar={UtilService.ConvertImg(item?.avatar) || DEMO_AVATAR}
                banner={UtilService.ConvertImg(item?.banner) || DEMO_BACKGROUND}
                username={item?.title}
                uniqueId={item?.description}
                collectionId={item._id}
                deletable={true}
                onDeleteCollection={() => onDelCollection(item._id)}
                gated
              />
            </div>
          ))}
        </div>

        <div className="spacer-single" />

        {modalDelIndex !== -1 &&
          <ModalDeleteCollection
            collectionId={modalDelIndex}
            onSuccess={() => setTrigger(trigger + 1)}
            onClose={() => setModalDelIndex(-1)}
          />
        }
      </LayoutScreen>
    </LayoutPage>
  )
};

export default Collections;
