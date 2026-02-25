import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import UtilService from '../../sip/utilService';
import { DEMO_BACKGROUND } from '../../keys';

const Box = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;

  img {
    width: 64px;
    height: 64px;
    border-radius: 9px;
    margin: 0 12px;
  }
`

const Container = styled.div`
  padding: 0 20px;
`

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const CollectionList = ({ collections }) => {

  const router = useRouter()
  const trending = collections?.sort(function (a, b) {
    return (b.volume) - (a.volume)
  })

  return (
    <div className='row'>
      <div className="col-xs-12 col-md-6">
        <Container>
          {trending.slice(0, 5).map((item, index) => {
            return (
              <Box key={index} onClick={() => router.push(`/subCollection/${item?._id}`)}>
                <Row>
                  <div style={{ width: 20 }}>{index + 1}</div>
                  <img src={UtilService.ConvertImg(item?.avatar) || DEMO_BACKGROUND} alt="" />
                  <div style={{ fontWeight: 'bold' }}>{item?.title}</div>
                </Row>
                <div>{item?.volume} volume</div>
              </Box>)
          })
          }
        </Container>
      </div>
      <div className="col-xs-12 col-md-6">
        <Container>
          {trending.slice(5, 10).map((item, index) => {
            return (
              <Box key={index} onClick={() => router.push(`/subCollection/${item?._id}`)}>
                <Row>
                  <div style={{ width: 20 }}>{index + 6}</div>
                  <img src={UtilService.ConvertImg(item?.avatar)} alt="" />
                  <div style={{ fontWeight: 'bold' }}>{item?.title}</div>
                </Row>
                <div>{item?.volume} volume</div>
              </Box>)
          })
          }
        </Container>
      </div>
    </div>
  );
}

export default CollectionList;

