import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useWindowSize from '../hooks/useWindowSize';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import ModalMinting from '../components/modals/modalMinting';
import NftLeftMenu from '../atoms/makeNFTs/nftLeftMenu';
import Step0 from '../atoms/makeNFTs/step0';
import Step1 from '../atoms/makeNFTs/step1';
import Step2 from '../atoms/makeNFTs/step2';
import Step3 from '../atoms/makeNFTs/step3';
import Step4 from '../atoms/makeNFTs/step4';
import Step5 from '../atoms/makeNFTs/step5';
import { useWeb3Auth } from '../services/web3auth';
import { getAllLazyMintsCount, getBrands } from '../common/api/authApi';

const MakeNFTsPage = ({ lazyMintsCount }) => {

  const { user } = useWeb3Auth()
  const { width } = useWindowSize()
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [showMintModal, setShowMintModal] = useState(true)
  const [isCongrat, setIsCongrat] = useState(false)
  const [brands, setBrands] = useState([])

  const { nft } = useSelector(state => state.nfts)
  const { step, baseFile, rate, tags, attributes } = nft

  useEffect(() => {
    const loadData = async () => {
      const response = await getBrands({ creatorId: user?.account })
      if (response) {
        const brands = response.map(item => {
          return {
            ...item,
            value: item._id,
            label: item.title,
          }
        })
        setBrands(brands)
      }
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  const handleClose = () => setIsOpenMenu(false)

  return (
    <LayoutPage congrat={isCongrat}>
      <LayoutScreen title='Create NFT'>
        <div className='d-flex flex-row'>
          {width > 850 && <NftLeftMenu brands={brands} />}
          {width <= 850 &&
            <Offcanvas style={{ width: 340, background: '#1a1a1a' }} show={isOpenMenu} placement='start' onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title className='color-b'>Create NFT</Offcanvas.Title>
              </Offcanvas.Header>
              <NftLeftMenu brands={brands} />
            </Offcanvas>
          }

          <div className='w-100 text-white' style={{ minHeight: '100vh' }}>
            <div className='h-100 mx-2 p-4' style={{ background: '#1a1a1a' }}>
              <div className='row' style={{ paddingTop: 80 }}>
                {step === 0 && <Step0 brands={brands} />}
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 baseFile={baseFile} rate={rate} />}
                {step === 3 && <Step3 />}
                {step === 4 && <Step4 tags={tags} attributes={attributes} />}
                {step === 5 && <Step5 lazyMintsCount={lazyMintsCount} onFinish={()=>setIsCongrat(true)} />}
              </div>
            </div>
          </div>

          {width <= 850 &&
            <picture>
              <img
                src='/img/menu.png'
                className='width-40 cursor-pointer position-absolute'
                alt=''
                style={{ left: 12 }}
                onClick={() => setIsOpenMenu(!isOpenMenu)}
              />
            </picture>
          }
          {showMintModal && <ModalMinting onClose={() => setShowMintModal(false)} />}
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response = await getAllLazyMintsCount()

  return {
    props: {
      lazyMintsCount: response || 0
    }
  }
}

export default MakeNFTsPage;
