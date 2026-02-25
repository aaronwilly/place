import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import LayoutPage from '../components/layouts/layoutPage';
import { MetaTag } from '../components/MetaTag';
import NFTSlide from '../atoms/home/NFTSlide';
import CollectionList from '../atoms/home/CollectionList';
import TopVideos from '../atoms/home/TopVideos';
import RealWorldNFTs from '../atoms/home/RealWorldNFTs';
import { useWeb3Auth } from '../services/web3auth';
import { CreateOnlineAccount, GetHomePageData, GetOnlineAccount, UpdateOnlineAccount } from '../common/api/noAuthApi';
import { handleRoute } from '../common/function';
import { ImgBigLogo } from '../common/icons';
import { DESCRIPTION } from '../keys';
import Link from "next/link"
import Image from "next/image"
import { Button } from "../components/ui/button"

const Box = styled.div`
  article {
    margin-top: 40px;
  }

  span {
    font-family: 'Ramabhadra', sans-serif;
    text-transform: uppercase;
    font-size: 50px;
    color: #bbb;
    text-align: center;
    cursor: pointer;
  }

  p {
    margin-bottom: 20px;
    font-size: 18px;
    text-align: center;
  }

  @media only screen and (max-width: 600px) {
    margin: 0 12px 0 0;
    text-align: center;

    article {
      margin-bottom: 15px;
    }

    span {
      font-size: 22px;
    }

    p {
      font-size: 12px;
      margin: -15px 12px 0 12px;
    }
  }
`

const Home = ({ collections, videos }) => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const { left_sidebar, right_sidebar } = useSelector(state => state.settings)
  const [isCopied, setIsCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const contractAddress = "CA: token is not launched yet!"

  const HOMEATOMS = [
    {
      title: 'Marketplace Keys',
      description: 'Buy/Sell your favourite Artist, Project, and Brand Or create your own Kilkpass!',
      link: '/nftmarketplace',
      container: <NFTSlide />
    },
    {
      title: 'Trending Rooms',
      description: 'Buy/Sell your favourite Artist, Project, and Brand Or create your own Kilkpass!',
      link: '/nftmarketplace',
      container: <CollectionList collections={collections} />
    },
    {
      title: 'Top Videos',
      description: 'Stand out and help people find and connect with you by choosing a unique Video',
      link: '/videos',
      container: <TopVideos videos={videos} />
    },
    {
      title: 'Real World KLIKPASS',
      description: 'Find KLIKPASS of physical goods and items Or create your own',
      link: '/nftmarketplace',
      container: <RealWorldNFTs />
    }
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const copyToClipboard = () => {
    if (isClient) {
      navigator.clipboard.writeText(contractAddress).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
    }
  }


  useEffect(() => {
    const onUpdateOnlineInfo = async () => {
      const response = await GetOnlineAccount({ account: user?.account })
      if (response) {
        await UpdateOnlineAccount({ _id: response?._id, time: new Date() })
      } else {
        await CreateOnlineAccount({
          account: user?.account,
          time: new Date(),
        })
      }
    }

    if (user?.account) {
      onUpdateOnlineInfo().then()
    }
  }, [user?.account])

  const AtomBox = (props) => {

    const { title, description, link, container } = props;

    return (
      <div className='pt-100 row'>
        <div className='col-lg-12'>
          <Box>
            <article>
              <span onClick={() => handleRoute(router, link)}>{title}</span>
            </article>
            <p className='color-7'>{description}</p>
          </Box>
        </div>
        <div className='col-lg-12 mb-5 color-b'>{container}</div>
      </div>
    )
  }

  return (
    <div>
      <MetaTag
        {...{
          title: 'Klik Homepage',
          description: DESCRIPTION,
          image: 'https://klik.cool/img/bg.png',
        }}
      />
      <LayoutPage backHidden>

        <section className="relative overflow-hidden py-32 sm:py-48 bg-gray-200	">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">

              <div className="w-1/2 mb-10 lg:mb-0 bg-cyan-500">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                  <span className="gradient-text">Revolutionizing Social Media</span> <br />
                  with Blockchain Technology
                </h1>
                <p className="text-xl mb-8 text-gray-400">
                  Explore a decentralized social media experience that allows direct connections between content creators and their audience through NFTs and tokenization.
                </p>
                <br /><br /><br />
                <div className="flex flex-wrap gap-4">
                  <Link href="https://app.joinklik.com" target="_blank" rel="noopener noreferrer">
                    <Button className="dark-button">Introduction</Button>
                  </Link> &nbsp;
                  <Link href="http://ico.joinklik.com" target="_blank" rel="noopener noreferrer">
                    <Button className="dark-button">Buy KlikCoins!</Button>
                  </Link> &nbsp;
                  <Link href="https://www.chainextrade.com/" target="_blank" rel="noopener noreferrer" >
                    <Button className="dark-button flex items-center gap-2 transition-all duration-300">
                      Trade crypto
                    </Button>
                  </Link>
                </div>
              </div>

              {/* <div className="w-1/2 bg-pink-500">
                <div className=" p-8 rounded-lg">
                  <Image
                    src={ImgBigLogo}
                    alt="Cryptix AI Logo - Spiral vortex in neon blue and purple"
                    width={100}
                    height={100}
                    className="rounded-lg w-full h-auto"
                    priority
                  />
                </div>
              </div> */}

            </div>
          </div>
        </section>

        {/* <div className='w-100' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', background: '#010101', padding: '60px', position: 'relative' }}>

          <div>
            <AwesomeBtn reverse title={'Introduction'} link={'https://app.joinklik.com'} /> <br />
            <AwesomeBtn reverse title={'Buy. KlikCoins!'} link={'http://ico.joinklik.com'} />
          </div>

          <CenterImg src={ImgBigLogo.src} className=' shadow' alt='banner' />

          <div>
            <AwesomeBtn title={'Trade.Crypto'} link={'https://www.chainextrade.com/'} /><br />
            <AwesomeBtn title={'Whitepaper'} link={'https://klik.gitbook.io/klik-ico'} />
          </div>

        </div> */}

        <div className={(!left_sidebar && !right_sidebar) ? 'home-container mt-4' : 'mt-4'}>
          {HOMEATOMS.map((item, index) => <div key={index}>{AtomBox(item)}</div>)}
        </div>
      </LayoutPage>
    </div>
  );
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response = await GetHomePageData()

  return {
    props: {
      collections: response?.collections || [],
      // communities: response?.communities || [],
      // discourses: response?.discourses || [],
      // musics: response?.musics || [],
      videos: response?.videos || [],
    }
  }
}

export default Home;
