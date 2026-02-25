import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import LayoutPage from '../components/layouts/layoutPage';
import GatedLeftMenu from '../atoms/createNFTcommunities/gatedLeftMenu';
import GatedDetailPage from '../atoms/createNFTcommunities/gatedDetailPage';
import useWindowSize from '../hooks/useWindowSize';
import { useWeb3Auth } from '../services/web3auth';
import { getAllLikes, getBrands, getCollections, getCommunities } from '../common/api/authApi';
import { Title } from '../constants/globalCss';

const TitleSection = styled.div`
  padding: 80px 0 40px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    padding: 40px 20px;
  }
`

function CreateGatePage({ allBrands, allCollections, communities, allLikes }) {

  const { user } = useWeb3Auth()
  const { width } = useWindowSize()
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [isCongrat, setIsCongrat] = useState(false)

  const { gated } = useSelector(state => state.nfts);
  const { brand } = gated;
  const filterBrands = useMemo(() => {
    const filtered = allBrands.filter(item => item?.creatorId === user?.account)
    if (filtered.length > 0) {
      const brands = filtered.map((item) => {
        return {
          ...item,
          value: item._id,
          label: item.title,
        }
      })
      return brands.concat({ value: 1, label: 'Create New Brand', link: true })
    } else {
      return [{ value: 1, label: 'Create New Brand', link: true }]
    }
  }, [allBrands, user])
  const filterCollections = useMemo(() => {
    const filtered = allCollections.filter(item => item?.creatorId === user?.account && item.brandId === brand?.value)
    if (filtered.length > 0) {
      const collections = filtered.map((item) => {
        return {
          ...item,
          value: item._id,
          label: item.title,
        }
      })
      return collections.concat({ value: 2, label: 'Create New Collection', link: true })
    } else {
      return [{ value: 2, label: 'Create New Collection', link: true }]
    }
  }, [allCollections, user, brand])

  const handleClose = () => setIsOpenMenu(false)

  return (
    <LayoutPage congrat={isCongrat}>
      <TitleSection>
        <Title>Create NFT Community</Title>
      </TitleSection>
      <br />
      <div className='d-flex flex-row'>
        {width > 850 && <GatedLeftMenu collections={filterCollections} brands={filterBrands} />}
        {width <= 850 &&
          <Offcanvas style={{ background: '#1a1a1a', width: 340 }} show={isOpenMenu} onHide={handleClose} placement='start'>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="color-b">Create NFT Community</Offcanvas.Title>
            </Offcanvas.Header>
            <GatedLeftMenu collections={filterCollections} brands={filterBrands}/>
          </Offcanvas>
        }

        <GatedDetailPage
          brands={filterBrands}
          allBrands={allBrands}
          collections={filterCollections}
          allCollections={allCollections}
          communities={communities}
          allLikes={allLikes}
          onFinish={() => setIsCongrat(true)}
        />

        {width <= 850 &&
          <picture>
            <img
              src="/img/menu.png"
              alt=""
              className="width-40 cursor-pointer position-absolute"
              style={{ left: 12 }}
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            />
          </picture>
        }
      </div>
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response1 = await getBrands({})
  const response2 = await getCollections({})
  const response3 = await getCommunities({})
  const response4 = await getAllLikes({})

  return {
    props: {
      allBrands: response1 || [],
      allCollections: response2 || [],
      communities: response3 || [],
      allLikes: response4 || [],
    }
  }
}

export default CreateGatePage;
