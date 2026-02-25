import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import LayoutPage from '../../components/layouts/layoutPage';
import CollectionCard from '../../components/cards/CollectionCard';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { getBrand, getCollections } from '../../common/api/authApi';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';

const Absolute = styled.div`
  margin-top: -100px;
  margin-left: 30px;
  position: absolute;
`

const IMG = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  border: 5px solid #fff;
`

const BrandDetail = ({ brand, collections }) => {

  const router = useRouter()
  const { user } = useWeb3Auth()

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  return (
    <LayoutPage>
      <section
        className='jumbotron breadcumb no-bg'
        style={{
          background: `url(${UtilService.ConvertImg(brand?.banner) || DEMO_BACKGROUND})` || '#141414',
          backgroundSize: 'cover'
        }}
      >
        <div className='mainbreadcumb' />

        <Absolute>
          <IMG src={UtilService.ConvertImg(brand?.avatar) || DEMO_AVATAR} alt='avatar' />

          <div>
            <h2 className='mt-3 color-b'>{brand?.title}</h2>
            <div className='color-b' style={{ marginTop: -8 }}>{brand?.description}</div>
            {user?._id === brand?.creator &&
              <div className='mt-3 btn btn-primary' onClick={() => handleRouters(`/edit/brand/${brand?._id}`)}>Edit</div>
            }
          </div>
        </Absolute>
      </section>

      <section>
        <h3 className='mt-90 color-b text-center'>Trending collections in {brand?.title}</h3>

        <div className='mt-10 d-flex flex-wrap align-items-center justify-content-center' style={{ minHeight: 335 }}>
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

export const getServerSideProps = async ({ query }) => {

  const { brandId } = query

  const response1 = await getBrand({ _id: brandId })
  const response2 = await getCollections({ brandId })

  return {
    props: {
      brand: response1 || null,
      collections: response2 || [],
    }
  }
}

export default BrandDetail;
