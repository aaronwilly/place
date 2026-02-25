import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import CollectionCard from '../../components/cards/CollectionCard';
import { getCollections } from '../../common/api/authApi';
import UtilService from '../../sip/utilService';
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';

const Collection = () => {

  const router = useRouter();
  const [collections, setCollections] = useState([]);

  const { collectionId } = router.query;
  const filtered = CATEGORIES_COLLECTIONS.find((item) => item.value === collectionId);

  useEffect(() => {
    const loadData = async () => {
      const response = await getCollections({ category: collectionId });
      response && setCollections(response);
    }

    loadData();
  }, [collectionId])

  return (
    <LayoutPage>
      <section
        className='jumbotron breadcumb no-bg '
        style={filtered?.banner ? { backgroundImage: `url(${filtered?.banner})`, backgroundPosition: 'center' } : { background: '#e5e8eb' }}
      >
        <div className='mainbreadcumb' />
      </section>

      <section>
        <div className='d-flex flex-column align-items-center justify-content-center'>
          <h1 className='color-b'>{filtered?.title}</h1>
          <div className='color-7 text-center' style={{ maxWidth: 700 }}>{filtered?.description}</div>
        </div>

        <h3 className='mt-90 color-b text-center'>Trending collections in {filtered?.category}</h3>

        <div className='mt-10 d-flex flex-wrap align-items-center justify-content-center' style={{ minHeight: 100 }}>
          {collections.map((item, index) => (
            <CollectionCard
              key={index}
              index={index + 1}
              avatar={UtilService.ConvertImg(item?.avatar) || DEMO_AVATAR}
              banner={UtilService.ConvertImg(item?.banner) || DEMO_BACKGROUND}
              username={item?.title}
              description={item?.description}
              collectionId={item?._id}
            />
          ))}
        </div>
      </section>
    </LayoutPage>
  )
};

export default Collection;
