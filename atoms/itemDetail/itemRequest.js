import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactTimeAgo from 'react-time-ago'
import { Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { useWeb3Auth } from '../../services/web3auth';
import { updateRequestOrder } from '../../common/api/authApi';
import { handleRoute } from '../../common/function';

const Accepted = styled.div`
  font-size: 12px;
  margin-left: 12px;
  margin-top: 12px;
  background: #0075ff;
  color: #fff;
  padding: 3px 8px;
  border-radius: 12px;
  opacity: 0.75;
`

const Rejected = styled.div`
  font-size: 12px;
  margin-left: 12px;
  margin-top: 12px;
  background: #fc4136;
  color: #fff;
  padding: 3px 8px;
  border-radius: 12px;
  opacity: 0.75
`

const Btn = styled.div`
  margin-top: 10px;
  background: #0075ff;
  padding: 1px 6px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 4px;
  color: #fff;
`

const Btn2 = styled.div`
  margin-top: 10px;
  background: #fc4136;
  padding: 1px 6px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 4px;
  color: #fff;
  margin-left: 12px;
`

const ItemRequest = ({ requestOrdersByTokenId }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, allUsers: users } = useWeb3Auth()
  const [isTitleOffers, setIsTitleOffers] = useState(true)
  const [requestData, setRequestData] = useState([])

  const { token_id: ercTokenId } = router.query

  useEffect(() => {
    setRequestData(requestOrdersByTokenId.filter(item => item?.acceptor === user?.account && item?.requestor !== null))
  }, [requestOrdersByTokenId, user?.account])

  function getUserNameFromAddress(tAdd) {
    if (users?.length === 0) {
      return '-'
    } else {
      const tt = users?.find(z => (z.account) === tAdd?.toLowerCase());
      return tt?.username;
    }
  }

  function getUserAvatarFromAddress(tAdd) {
    if (users?.length === 0) {
      return '-'
    } else {
      const tt = users?.find(z => (z.account) === tAdd?.toLowerCase());
      return tt?.avatar;
    }
  }

  const onAcceptOrder = useCallback(async (requesterId) => {
    const filtered = requestOrdersByTokenId.find(item => item?.acceptor === user?.account && item?.requestor === requesterId)
    if (filtered) {
      const response = await updateRequestOrder({ _id: filtered?._id, confirmed: true })
      response && response.data && setRequestData(requestData.map(item => item?._id === response.data?._id ? response.data : item))
    }

    dispatch(addNotification('Request Accepted!', 'success'))
  }, [dispatch, ercTokenId, requestData, requestOrdersByTokenId, user?.account])

  const onRejectOrder = useCallback(async (requesterId) => {
    const filtered = requestOrdersByTokenId.find(item => item?.acceptor === user?.account && item?.requestor === requesterId)
    if (filtered) {
      const response = await updateRequestOrder({ _id: filtered?._id, rejected: true })
      response && response.data && setRequestData(requestData.map(item => item?._id === response.data?._id ? response.data : item))
    }

    dispatch(addNotification('Request Rejected!', 'success'))
  }, [dispatch, ercTokenId, requestData, requestOrdersByTokenId, user?.account])

  return (
    <div>
      <div className='offer-title' onClick={() => setIsTitleOffers(!isTitleOffers)}>
        <div><span aria-hidden="true" className="icon_ul" />&nbsp;&nbsp;Request</div>
        <span aria-hidden="true" className={`arrow_carrot-${!isTitleOffers ? 'down' : 'up'} fs-24`} />
      </div>

      {isTitleOffers && <div className='offer-body'>
        <div className="de_tab w-100">
          <div className='offer-body'>
            <div className="w-100">
              {requestData.length === 0 && <p>No requests yet</p>}
              {requestData.length > 0 &&
                <Table className='color-7'>
                  <thead>
                  <tr>
                    <th>No</th>
                    <th>From</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {requestData?.map((item, index) =>
                    <tr key={index}>
                      <td>
                        <div style={{ marginTop: 10 }}>{index + 1}</div>
                      </td>
                      <td className='cursor-pointer' style={{ color: '#3291e9' }} onClick={() => handleRoute(router, `/sales/${item.requestor}`)}>
                        <picture>
                          <img
                            src={getUserAvatarFromAddress(item.requestor)}
                            alt=''
                            className='width-40 height-40 br-50 object-cover'
                            style={{ marginRight: 12 }}
                          />
                        </picture>
                        {getUserNameFromAddress(item.requestor)}
                      </td>
                      <td>
                        <div style={{ marginTop: 10 }}>
                          {<ReactTimeAgo date={new Date(item.createdAt)} locale="en-US"/>}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-row align-items-center">
                          {!item.rejected && (item.confirmed ? <Accepted>Accepted</Accepted> : <Btn onClick={() => onAcceptOrder(item.requestor)}>Accept</Btn>)}
                          {!item.confirmed && (item.rejected ? <Rejected>Rejected</Rejected> : <Btn2 onClick={() => onRejectOrder(item.requestor)}>Reject</Btn2>)}
                        </div>
                      </td>
                    </tr>
                  )}
                  </tbody>
                </Table>
              }
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default ItemRequest;
