import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { GetCommunities } from '../../common/api/noAuthApi';
import { handleRoute } from '../../common/function';
import UtilService from '../../sip/utilService';

const HeaderSearch = () => {

  const router = useRouter()
  const [searchKey, setSearchKey] = useState('')
  const [isShow, setIsShow] = useState(false)
  const [communities, setCommunities] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const response = await GetCommunities({})
      response && setCommunities(response)
    }

    loadData().then()
  }, [])

  return (
    <div className='d-flex position-relative' style={{ maxWidth: 550, borderRadius: 10, marginLeft: 12, marginRight: 12, flex: 1 }}>
      <picture>
        <img src={'/img/search-black.png'} alt='search-black' className='position-absolute' style={{ position: 'absolute', top: 12, right: 12 }} />
      </picture>
      <input
        className='top-search main-font'
        placeholder='Search Communities'
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        onClick={() => setIsShow(true)}
      />
      {isShow &&
        <div
          className='w-100 overflow-auto position-absolute'
          style={{
            maxHeight: 300,
            background: '#222528',
            padding: 12,
            boxShadow: '0 0.25rem 0.25rem rgb(0 0 0 / 25%)',
            top: 50,
            zIndex: 100,
            border: '1px solid #444'
          }}>
          <OutsideClickHandler onOutsideClick={() => setIsShow(false)}>
            {communities.map((nft, index) => {
              if (searchKey && !nft?.title?.toLowerCase().includes(searchKey?.toLowerCase())) {
                return null
              }
              return (
                <div
                  key={index}
                  className='d-flex flex-row align-items-center cursor-pointer'
                  onClick={() => { setIsShow(false); handleRoute(router, `/nftcommunities?search=${nft?.title}`) }}
                >
                  <div className='width-50 height-50 d-flex align-items-start justify-content-center'>
                    <picture>
                      <img src={UtilService.ConvertImg(nft?.img)} alt='' style={{ width: 'auto', maxHeight: 40, maxWidth: 40 }} />
                    </picture>
                  </div>
                  <div style={{ marginLeft: 12 }}>{nft?.title}</div>
                </div>
              )
            })}
          </OutsideClickHandler>
        </div>
      }
    </div>
  );
};

export default HeaderSearch;
