import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateGated } from '../../store/actions/nfts/nfts';
import CardCommunity from '../../components/cards/CardCommunity';
import ModalBrandCollectionError from '../../components/modals/warnings/modalBrandCollectionError';
import { useWeb3Auth } from '../../services/web3auth';

function GateStep0({ brands, collections, allBrands, allCollections, communities }) {

  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [isModal, setIsModal] = useState(false)

  const { gated } = useSelector(state => state.nfts)
  const { users } = useSelector(state => state.users)
  const { brand, collection } = gated;
  const memoCommunities = useMemo(() => communities.filter(item => item?.owner === user?._id), [communities, user?._id])

  const collectionMap = useMemo(() => [], []);
  const brandMap = useMemo(() => [], []);
  const ownerMap = useMemo(() => [], []);

  allCollections.forEach(x => collectionMap[x.id] = x);
  allBrands.forEach(x => brandMap[x.id] = x);
  users.forEach(x => ownerMap[x.id] = x);

  const getGateCollection = useCallback((collection) => collectionMap[collection], [collectionMap])
  const getBrand = useCallback((brand) => brandMap[brand], [brandMap])
  const getOwner = useCallback((user) => ownerMap[user], [ownerMap])

  const filteredCommunities = memoCommunities.reduce(function (filtered, item) {
    const gateBrand = getBrand(item?.brand);
    const gateCollection = getGateCollection(item?.collection)

    const owner = getOwner(item?.owner)
    filtered.push({
      id: item._id,
      gateImg: item?.img,
      avatar: owner?.avatar,
      title: item?.title,
      brand: gateBrand?.title || '-',
      collection: gateCollection?.title || '-',
      other: item?.type + ' • ' + item?.status,
      contents: JSON.parse(item?.contents),
      nfts: JSON.parse(item?.nfts || '{}'),
      globalNFTs: JSON.parse(item?.globalNFTs || '{}'),
    })
    return filtered
  }, [])

  const onStart = () => {
    if(!(collection && brand)){
      setIsModal(true);
      return false;
    }
    dispatch(onUpdateGated({ step: 1 }))
  }

  return (
    <div className='d-center'>

      {brands?.length === 0 && <div className="alert alert-danger text-center" style={{ marginTop: 10 }}>
        You must <Link href='/create/brand' className='text-decoration-underline' prefetch={false}> create </Link> at least one brand before minting.
      </div>}

      {collections?.length === 0 &&
        <div className="alert alert-danger text-center" style={{ marginTop: 10 }}>
          You have to <Link href='/create/collection' className='text-decoration-underline' prefetch={false}> create </Link> at least one collection before minting.
        </div>
      }

      <button className='btn btn-primary' onClick={onStart}>Create</button>

      <br/>
      <div className="fs-24 color-b">My Communities</div>
      <div className='w-100 mt-2'>
        <div className='d-flex flex-row flex-wrap align-items-center justify-content-center'>
          {filteredCommunities.map((item, index) => <CardCommunity key={index} community={item} />)}
        </div>
      </div>

      {isModal && <ModalBrandCollectionError onClose={() => setIsModal(false)} />}
    </div>
  )
}

export default GateStep0;
