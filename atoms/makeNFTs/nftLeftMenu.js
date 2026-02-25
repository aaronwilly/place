import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateCreator } from '../../store/actions/nfts/nfts';
import { useWeb3Auth } from '../../services/web3auth';
import { getCollections } from '../../common/api/authApi';
import { handleRoute } from '../../common/function';

const NftLeftMenu = ({ brands }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [showBrand, setShowBrand] = useState(false)
  const [showCollection, setShowCollection] = useState(false)
  const [collections, setCollections] = useState([])

  const { nft } = useSelector(state => state.nfts)
  const { collection, brand, step, title, description, file } = nft

  const FILTER_BRANDS = brands.concat({ value: 1, label: 'Create New Brand', link: true })
  const FILTER_COLLECTIONS = useMemo(() => collections.concat({ value: 1, label: 'Create New Collection', link: true }), [collections])

  const step1_disabled = false;
  const step2_disabled = step1_disabled || !title || !description;
  const step3_disabled = step2_disabled || !file;
  const step4_disabled = step3_disabled;
  const step5_disabled = step4_disabled;

  useEffect(() => {
    const loadData = async () => {
      const response = await getCollections({ creatorId: user?.account, brandId: brand?.value })
      if (response) {
        const collections = response.map(item => {
          return {
            ...item,
            value: item._id,
            label: item.title,
          }
        })
        setCollections(collections)
      }
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user, brand])

  return (
    <div className='filter-profile'>
      <div className='filter-title filterHeader m-0 d-flex justify-content-center align-items-center'>START</div>
      <div className="accordion">
        <div className='divider' />
        <div>
          <h2 className="accordion-header" id="panelsStayOpen-headingFour">
            <button
              className="accordion-button acodiHeadTxt collapsed text-white"
              style={{ background: '#1a1a1a' }}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseFour"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseFour">
              Brand
            </button>
          </h2>

          <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingFour">
            <div className="accordion-body p-4">
              <div className="row g-3">
                <div className='dropdownSelect one'>
                  <div id="SelectFilter" onClick={() => setShowBrand(!showBrand)}>
                    {brand ? brand?.label : 'Select Brand'}
                    {showBrand ?
                      <div id="optionFilter">
                        {FILTER_BRANDS.map((item, index) => {
                          return <div
                            key={index}
                            className="dropOption cursor-pointer"
                            onClick={() => item?.link ? handleRoute(router, '/create/brand') : dispatch(onUpdateCreator({ brand: item }))}>
                            <div className={`py-2 ${item?.link && 'color-sky'}`}>{item?.label}</div>
                          </div>
                        })}
                      </div>
                      :
                      ''
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='divider' />
        <div>
          <h2 className="accordion-header" id="panelsStayOpen-headingFive">
            <button
              className="accordion-button acodiHeadTxt collapsed text-white"
              style={{ background: '#1a1a1a' }}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseFive"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseFive">
              Collection
            </button>
          </h2>

          <div id="panelsStayOpen-collapseFive" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingFive">
            <div className="accordion-body p-4">
              <div className="row g-3">
                <div className='dropdownSelect one'>
                  <div id="SelectFilter" onClick={() => setShowCollection(!showCollection)}>
                    {collection ? collection?.label : 'Select Collection'}
                    {showCollection ?
                      <div id="optionFilter">
                        {FILTER_COLLECTIONS.map((item, index) => {
                          return <div
                            key={index}
                            className="dropOption cursor-pointer"
                            onClick={() => item?.link ? handleRoute(router, '/create/collection') : dispatch(onUpdateCreator({ collection: item }))}>
                            <div className={`py-2 ${item?.link && 'color-sky'}`}>{item?.label}</div>
                          </div>
                        })}
                      </div>
                      :
                      ''
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='divider' />
        <div className="my-4">
          <div className="px-4 py-0">
            <div className={`${step === 1 ? 'green-btn' : 'grey-btn'} my-3 ${step1_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 1 }))}>Details</div>
            <div className={`${step === 2 ? 'green-btn' : 'grey-btn'} my-3 ${step2_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 2 }))}>Content</div>
            <div className={`${step === 3 ? 'green-btn' : 'grey-btn'} my-3 ${step3_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 3 }))}>Authentication (optional)</div>
            <div className={`${step === 4 ? 'green-btn' : 'grey-btn'} my-3 ${step4_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 4 }))}>Attributes</div>
            <div className={`${step === 5 ? 'green-btn' : 'grey-btn'} my-3 ${step5_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 5 }))}>Royalties</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NftLeftMenu;
