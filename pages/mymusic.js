import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import CustomDisplayMusic from '../components/custom/CustomDisplayMusic';
import { useWeb3Auth } from '../services/web3auth';
import { getMusics } from '../common/api/authApi';
import { handleRoute } from '../common/function';

const MyMusicPage = () => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [musics, setMusics] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const response = await getMusics({ creatorId: user?.account })
      response && setMusics(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  return (
    <LayoutPage>
      <LayoutScreen title='My Music'>
        <div className='my-5 d-flex flex-row flex-wrap align-items-center justify-content-center'>
          {musics.map((item, index) => (
            <CustomDisplayMusic key={index} music={item} onGoClick={() => handleRoute(router, `/musics/${item?._id}`)} />
          ))}
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default MyMusicPage;
