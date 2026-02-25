import React from 'react';
import styled from 'styled-components';
import { useWeb3Auth } from '../../services/web3auth';
import { Title } from '../../constants/globalCss';

const CTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
`

const Box = styled.div`
  width: 320px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const AnalysisProjects = ({ brands, collections }) => {

  const { user } = useWeb3Auth()

  return (
    <div className="color-b">
      <Title>Klik Projects</Title>
      <br/><br/>
      <Box>
        <CTitle>Total Brands</CTitle>
        <div>{brands.length}</div>
      </Box>
      <Box>
        <CTitle>Total Collections</CTitle>
        <div>{collections.length}</div>
      </Box>

      <Box>
        <CTitle>Total My Brands</CTitle>
        <div>{brands.filter(item => item?.creator === user?._id).length}</div>
      </Box>
      <Box>
        <CTitle>Total My Collections</CTitle>
        <div>{collections.filter(item => item?.creator === user?._id).length}</div>
      </Box>
    </div>
  );
};

export default AnalysisProjects;