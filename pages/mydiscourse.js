import React, { useEffect, useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import CustomDisplayDiscord from '../components/custom/CustomDisplayDiscord';
import { useWeb3Auth } from '../services/web3auth';
import { getDiscourses } from '../common/api/authApi';

const MyDiscoursePage = () => {

  const { user } = useWeb3Auth()
  const [data, setData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const response = await getDiscourses({ creatorId: user?.account })
      response && setData(response)
    }

    if (user?.account) {
      loadData().then()
    }
  }, [user])

  return (
    <LayoutPage>
      <LayoutScreen title='Discourse'>
        <div className='mt-3 d-flex flex-row flex-wrap align-items-center justify-content-center'>
          {data.map((item, index) => <CustomDisplayDiscord key={index} item={item} />)}
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
}

export default MyDiscoursePage
