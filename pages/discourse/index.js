import React from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import CustomDisplayDiscord from '../../components/custom/CustomDisplayDiscord';
import { GetDiscourses } from '../../common/api/noAuthApi';

const DiscoursePage = ({ discourseServers }) => {

  return (
    <LayoutPage>
      <LayoutScreen title='Discourse'>
        <div className='mt-3 d-flex flex-row flex-wrap align-items-center justify-content-center'>
          {discourseServers.map((item, index) => <CustomDisplayDiscord key={index} item={item} />)}
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response = await GetDiscourses({})

  return {
    props: {
      discourseServers: response || [],
    }
  }
}

export default DiscoursePage;
