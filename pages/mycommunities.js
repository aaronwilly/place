import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import LayoutPage from '../components/layouts/layoutPage';
import GatedLeftSearch from '../atoms/sales/gatedLeftSearch';
import GatedFilterBar from '../atoms/sales/GatedFilterBar';
import CardCommunity from '../components/cards/CardCommunity';
import { useWeb3Auth } from '../services/web3auth';
import { getBrands, getCollections, getCommunities } from '../common/api/authApi';
import { CATEGORIES_COLLECTIONS } from '../constants/hotCollections';
import { Title } from '../constants/globalCss';

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

const TitleSection = styled.div`
  padding: 80px 0 40px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    padding: 40px 20px;
  }
`

const MyCommunities = ({ brands, collections }) => {

  const { user } = useWeb3Auth()
  const [communities, setCommunities] = useState([])
  const [category, setCategory] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [gateSearch, setGateSearch] = useState({ type: null, brand: null, collection: null })

  const filteredCommunities = useMemo(() => communities.filter(item => item?.title?.toLowerCase().includes(searchKey.toLowerCase()) && item?.brand?.category.includes(category.toLowerCase())), [communities, searchKey, category])
  const filterBrands = brands.map((item) => ({ value: item._id, label: item.title }))
  const filterCollections = collections.map((item) => ({ value: item._id, label: item.title }))

  useEffect(() => {
    const loadData = async () => {
      const response = await getCommunities({ creatorId: user?.account })
      response && setCommunities(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  const onChangeSearchKey = e => setSearchKey(e.target.value)

  const onSelectCategory = value => setCategory(category === value ? '' : value)

  return (
    <LayoutPage>
      <TitleSection>
        <Title>My NFT Communities</Title>
      </TitleSection>

      <div className='d-flex flex-row'>
        <GatedLeftSearch
          brands={filterBrands}
          collections={filterCollections}
          search={gateSearch}
          setGateSearch={setGateSearch}
        />
        <div className='w-100 mx-4'>
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
              </AtomBtn>
            )}
          </div>

          <GatedFilterBar search={gateSearch} setGateSearch={setGateSearch} />

          <div className='w-100 mt-2'>
            <div className='d-flex flex-row flex-wrap align-items-center justify-content-center'>
              {filteredCommunities?.length === 0 && !category &&
                <div className="alert alert-danger text-center" style={{ marginTop: 20 }}>
                  Create your first <Link href='/createNFTcommunities' className='text-decoration-underline' prefetch={false}> community</Link>
                </div>
              }
              {filteredCommunities.map((item, index) => <CardCommunity key={index} community={item} />)}
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  )
};

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response1 = await getBrands({})
  const response2 = await getCollections({})

  return {
    props: {
      brands: response1 || [],
      collections: response2 || [],
    }
  }
}

export default MyCommunities;
