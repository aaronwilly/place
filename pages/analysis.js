import React, { useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import AnalysisDashboard from '../atoms/analysis/analysisDashboard';
import AnalysisMetasalt from '../atoms/analysis/analysisMetasalt';
import AnalysisProjects from '../atoms/analysis/analysisProjects';
import AnalysisEarnings from '../atoms/analysis/analysisEarnings';
import AnalysisTransactions from '../atoms/analysis/analysisTransactions';
import { getAllLikes, getBrands, getCollections, getCommunities, getOrderData } from '../common/api/authApi';

const Analysis = ({ orderData, communities, brands, collections }) => {

  const [tab, setTab] = useState(0)

  return (
    <LayoutPage>
      <div className='row color-b'>
        <div className='col-xl-2 col-md-3 col-sm-12 bg-1 p-4' style={{ minHeight: 800 }}>
          <br /><br />
          <div className={`mt-3 fs-20 fw-semibold cursor-pointer ${tab === 0 && 'color-purple'}`} onClick={() => setTab(0)}>Dashboard</div>
          <div className={`mt-3 fs-20 fw-semibold cursor-pointer ${tab === 1 && 'color-purple'}`} onClick={() => setTab(1)}>Klik</div>
          <div className={`mt-3 fs-20 fw-semibold cursor-pointer ${tab === 2 && 'color-purple'}`} onClick={() => setTab(2)}>Projects</div>
          <div className={`mt-3 fs-20 fw-semibold cursor-pointer ${tab === 3 && 'color-purple'}`} onClick={() => setTab(3)}>Earnings</div>
          <div className={`mt-3 fs-20 fw-semibold cursor-pointer ${tab === 4 && 'color-purple'}`} onClick={() => setTab(4)}>Transactions</div>
        </div>

        <div className='col-xl-10 col-md-9 col-sm-12 p-3'>
          {tab === 0 && <AnalysisDashboard {...{ orderData, communities }} />}
          {tab === 1 && <AnalysisMetasalt {...{ communities }} />}
          {tab === 2 && <AnalysisProjects {...{ brands, collections }} />}
          {tab === 3 && <AnalysisEarnings />}
          {tab === 4 && <AnalysisTransactions />}
        </div>
      </div>
    </LayoutPage>
  );
}

export const getServerSideProps = async ({ res }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const response1 = await getOrderData({})
  const response2 = await getCommunities({})
  const response3 = await getBrands({})
  const response4 = await getCollections({})
  const response5 = await getAllLikes({})

  return {
    props: {
      orderData: response1 || [],
      communities: response2 || [],
      brands: response3 || [],
      collections: response4 || [],
      allLikes: response5 || [],
    }
  }
}

export default Analysis;
