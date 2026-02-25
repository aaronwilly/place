import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useWeb3Auth } from '../../services/web3auth';
import { Title } from '../../constants/globalCss';

const CTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
`

const Box = styled.div`
  width: 620px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media only screen and (max-width: 700px) {
    width: 320px;
    flex-direction: column;
  }
`

const AnalysisMetasalt = ({ communities }) => {

  const { allUsers } = useWeb3Auth()
  const { nfts } = useSelector(state => state.nfts);

  return (
    <div className="color-b">
      <Title>Klik Analysis</Title>

      <Box>
        <CTitle>Total ERC1155 NFTs</CTitle>
        <div>{nfts.length}</div>
      </Box>
      <Box>
        <CTitle>Total Lazy Mint NFTs</CTitle>
        <div>{nfts.filter(item => item.lazyMint).length}</div>
      </Box>
      <Box>
        <CTitle>Total Normal Mint NFTs</CTitle>
        <div>{nfts.filter(item => !item.lazyMint).length}</div>
      </Box>
      <Box>
        <CTitle>Total Users</CTitle>
        <div>{allUsers.length}</div>
      </Box>
      <Box>
        <CTitle>Total NFT Communities</CTitle>
        <div>{communities.length}</div>
      </Box>
    </div>
  );
};

export default AnalysisMetasalt;
