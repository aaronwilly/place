import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Offcanvas } from 'react-bootstrap';
import LayoutPage from '../../components/layouts/layoutPage';
import GatedLeftSearch from '../../atoms/sales/gatedLeftSearch';
import GatedFilterBar from '../../atoms/sales/GatedFilterBar';
import CommunityTab from '../../atoms/sales/CommunityTab';
import CardCommunity from '../../components/cards/CardCommunity';
import useWindowSize from '../../hooks/useWindowSize';
import { MetaTag } from '../../components/MetaTag';
import { GetBrands, GetCollections, GetCommunities } from '../../common/api/noAuthApi';
import { Description, Title } from '../../constants/globalCss'
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';

const TitleSection = styled.div`
  padding: 80px 0 40px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    padding: 40px 20px;
  }
`

const AtomBtn = styled.div`
  border-radius: 16px;
  border: 1px solid #555;
  margin: 5px;
  padding: 5px 11px;
  color: #555;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    padding: 2px 7px;
    font-size: 14px
  }

  ${props => props.selected &&
    css`
      color: #ddd;
      background: #444
   `
  }
`

const CommunitiesPage = ({ brands, collections, communities }) => {

  const router = useRouter()
  const { width } = useWindowSize()
  const [isActive, setIsActive] = useState(1);
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [gateSearch, setGateSearch] = useState({ type: null, brand: null, collection: null })
  const [category, setCategory] = useState('')
  const [searchKey, setSearchKey] = useState('')

  const search = router.query?.search
  const cKey = searchKey?.toLowerCase()

  const filteredCommunities = communities.filter(item => item?.title?.toLowerCase().includes(cKey))

  const filteredBrands = brands.map(item => ({
    value: item._id,
    label: item?.title,
  }))

  const filteredCollections = collections.map(item => ({
    value: item._id,
    label: item?.title,
  }))

  useEffect(() => {
    if (search) {
      setSearchKey(search.replace(/%20/g, ' '))
    }
    if (search && search.includes('?collection=')) {

      const collectionId = search.substring(12).replace(/%20/g, ' ');
      const collectOb = collections.find(item => item._id === collectionId)

      setGateSearch({
        ...gateSearch,
        collection: {
          label: collectOb?.title,
          value: collectionId,
        }
      })
    }
  }, [search, collections])

  const onChangeSearchKey = e => setSearchKey(e.target.value)

  const handleClose = () => {
    setIsOpenMenu(false)
  }

  const onSelectCategory = (value) => {
    setCategory(category === value ? '' : value)
  }

  return (
    <div>
      <MetaTag
        {...{
          title: 'All NFT Communities',
          description: 'Search, Join, and Interact with your favorite communities',
          image: 'https://ucarecdn.com/1bd723ba-565e-4e85-913b-4fc06751746f/Screenshot_1.png',
        }}
      />
      <LayoutPage>
        <TitleSection>
          <Title>All NFT Communities</Title>
          <Description>Search, Join, and Interact with your favorite communities</Description>
        </TitleSection>

        <div>
          <CommunityTab {...{ filteredCommunities, isActive, setIsActive }} />

          <div className='d-flex flex-row'>
            {width > 850 &&
              <GatedLeftSearch
                brands={filteredBrands}
                collections={filteredCollections}
                search={gateSearch}
                setGateSearch={setGateSearch}
              />
            }

            {width <= 850 &&
              <Offcanvas
                style={{ background: '#1a1a1a', width: 340 }}
                placement='start'
                show={isOpenMenu}
                onHide={handleClose}
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title className="color-b">Search</Offcanvas.Title>
                </Offcanvas.Header>
                <GatedLeftSearch
                  collections={filteredCollections}
                  brands={filteredBrands}
                  search={gateSearch}
                  setGateSearch={setGateSearch}
                />
              </Offcanvas>
            }

            {width <= 850 &&
              <picture>
                <img
                  src="/img/menu.png"
                  className="width-40 cursor-pointer position-absolute"
                  alt=""
                  style={{ marginTop: 50, left: 12 }}
                  onClick={() => setIsOpenMenu(!isOpenMenu)}
                />
              </picture>
            }

            <div className='w-100 mx-4 mt-4'>
              <input
                type="text"
                className="serchBar"
                name="search"
                placeholder="Search Title"
                value={searchKey}
                onChange={onChangeSearchKey}
              />

              <div className='mt-4 d-flex flex-row flex-wrap align-items-center justify-content-center'>
                {CATEGORIES_COLLECTIONS.map((item, index) =>
                  <AtomBtn
                    key={index}
                    selected={category === item.value}
                    onClick={() => onSelectCategory(item.value)}
                  >
                    {item.label}
                  </AtomBtn>)}
              </div>

              <GatedFilterBar search={gateSearch} setGateSearch={setGateSearch} />

              <div className='w-100 mt-2 mb-5'>
                <div className='d-flex flex-row flex-wrap align-items-center justify-content-center'>
                  {filteredCommunities.map((item, index) => <CardCommunity key={index} community={item} />)}
                </div>
              </div>

            </div>
          </div>
        </div>
      </LayoutPage>
    </div>
  )
};

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response1 = await GetBrands({})
  const response2 = await GetCollections({})
  const response3 = await GetCommunities({})

  return {
    props: {
      brands: response1 || [],
      collections: response2 || [],
      communities: response3 || [],
    }
  }
}

export default CommunitiesPage;
