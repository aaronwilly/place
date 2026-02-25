import React from 'react';
import { useSelector } from 'react-redux';
import GateStep5 from './gateStep5';
import GateStep4 from './gateStep4';
import GateStep3 from './gateStep3';
import GateStep2 from './gateStep2';
import GateStep1 from './gateStep1';
import GateStep0 from './gateStep0';

const GatedDetailPage = ({
  brands = [],
  allBrands = [],
  collections = [],
  allCollections = [],
  communities = [],
  allLikes = [],
  onFinish,
}) => {

  const { gated } = useSelector(state => state.nfts);
  const { step, baseFile } = gated;

  return (
    <div className='w-100 text-white' style={{ minHeight: '100vh' }}>
      <div className="h-100 mx-2 p-4" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="row" style={{ paddingTop: 80 }}>
          {step === 0 && <GateStep0 {...{ brands, collections, allBrands, allCollections, communities, allLikes }} />}
          {step === 1 && <GateStep1 />}
          {step === 2 && <GateStep2 baseFile={baseFile} />}
          {/* {step === 3 && <GateStep3 />} */}
          {step === 4 && <GateStep4 />}
          {step === 5 && <GateStep5 onFinish={onFinish} />}
        </div>
      </div>
    </div>
  )
};

export default GatedDetailPage;
