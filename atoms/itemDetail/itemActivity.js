import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import ReactTimeAgo from 'react-time-ago';
import { Table } from 'react-bootstrap';
import { Alchemy } from 'alchemy-sdk';
import moment from 'moment';
import useWindowSize from '../../hooks/useWindowSize';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { handleRoute } from '../../common/function';
import { ALCHEMY_KEY } from '../../keys';

const TRow = styled.tr`
  @media only screen and (max-width: 600px) {
    flex-direction: column;
    display: flex;
    margin: 3px;
    line-height: 0.3;
    font-size: 12px;

    td {
      border-style: none;
      margin-top: 4px;
    }
  }
`

const ItemActivity = ({ sales, lazyMintTransfers: lazyTransfers }) => {

  const router = useRouter()
  const { web3Auth, allUsers: users } = useWeb3Auth()
  const { width } = useWindowSize()
  const [transactions, setTransactions] = useState([])
  const [isTitleListings, setIsTitleListings] = useState(true)
  const [isErc1155Listings, setIsErc1155Listings] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { net, token_address, token_id } = router.query;
  const hexToDecimal = hex => parseInt(hex, 16);

  const lazyTrans = lazyTransfers.map(x => {
    return {
      value: 0,
      title: 'Transfer',
      from_address: x.from_address,
      to_address: x.to_address,
      block_timestamp: x.createdAt,
      amount: x.amount
    }
  })

  const activities = [...transactions, ...lazyTrans].sort(function (a, b) {
    return new Date(b.block_timestamp) - new Date(a.block_timestamp)
  });

  useEffect(() => {
    if (token_id && web3Auth) {
      fetchContractNFTTransfers().then()
    }
  }, [token_id, web3Auth])

  const fetchContractNFTTransfers = async () => {
    setIsLoading(true)

    const alchemy = new Alchemy({
      apiKey: ALCHEMY_KEY,
      network: UtilService.alchemyNet(net),
    })

    const res = await alchemy.core.getAssetTransfers({
      fromBlock: '0x0',
      contractAddresses: [token_address],
      excludeZeroValue: true,
      category: ['erc721', 'erc1155'],
    })

    const allData = await Promise.all(res.transfers.map(async item => {
      const tId = item.tokenId || item.erc1155Metadata[0].tokenId;
      if(tId !== token_id) return null
      const pp =  await alchemy.core.getTransaction(item.hash)
      const block = await alchemy.core.getBlock(pp?.blockNumber || 0)

      return {
        from_address: item.from,
        to_address: item.to,
        value: hexToDecimal(pp?.value?._hex) / 1000000000000000000 || 0,
        amount: item?.erc1155Metadata ? hexToDecimal(item.erc1155Metadata[0].value) : 1,
        block_timestamp: block?.timestamp,
      }
    }))

    setTransactions(allData.filter(c => !!c).sort(function (a, b) {
      return new Date(b.block_timestamp) - new Date(a.block_timestamp)
    }))

    setIsLoading(false)
  };

  function getUserNameFromAddress(address) {
    if (users?.length === 0) {
      return '-'
    } else {
      const tt = users?.find(z => (z.account?.toLowerCase()) === address?.toLowerCase());
      return tt?.username || UtilService.truncate(address);
    }
  }

  return (
    <div>
      <div className='offer-title' onClick={() => setIsTitleListings(!isTitleListings)}>
        <div><span aria-hidden="true" className="icon_tag_alt" />&nbsp;&nbsp;Activity</div>
        <span aria-hidden="true" className={`arrow_carrot-${!isTitleListings ? 'down' : 'up'} fs-24`} />
      </div>

      {isTitleListings &&
        <div className='offer-body'>
          <div className="w-100 overflow-auto" style={{ maxHeight: 300 }}>
            {isLoading ?
              <div>
                <Skeleton height={30} />
                <Skeleton height={30} />
                <Skeleton height={30} />
              </div>
              :
              <div>
                {activities.length > 0 ?
                  <Table className="color-7">
                    {width > 850 &&
                      <thead>
                        <tr>
                          <th>Event</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                    }
                    {width > 850 ?
                      <tbody className='color-b'>
                        {activities?.map((item, index) =>
                          <tr key={index}>
                            {/* <td>{index === activities.length - 1 ? 'Minted' : item.title || 'Sale'}</td> */}
                            <td>{item.title || 'Sale'}</td>
                            <td>{item.value}</td>
                            <td>{item.amount}</td>
                            <td style={{ color: '#3291e9', cursor: 'pointer', maxWidth: 120, overflow: 'hidden' }} onClick={() => handleRoute(router, `/sales/${item.from_address}`)}>
                              {getUserNameFromAddress(item.from_address)}
                            </td>
                            <td style={{ color: '#3291e9', cursor: 'pointer', maxWidth: 120, overflow: 'hidden' }} onClick={() => handleRoute(router, `/sales/${item.to_address}`)}>
                              {getUserNameFromAddress(item.to_address)}
                            </td>
                            <td><ReactTimeAgo date={typeof item.block_timestamp === 'number' ? moment.unix(item.block_timestamp) : moment(item.block_timestamp)} locale="en-US" /></td>
                          </tr>
                        )}
                      </tbody>
                      :
                      <div className='color-b'>
                        {activities?.map((item, index) =>
                          <div
                            style={{ background: '#222', margin: 3, fontSize: 12, lineHeight: 0.6 }} key={index}>
                            <td>{index === activities.length - 1 ? 'Minted' : 'Transfer'}</td>
                            <div>Price: {item.value}</div>
                            <div>Quantity: {item.amount}</div>
                            <div style={{ color: '#3291e9', cursor: 'pointer' }} onClick={() => handleRoute(router, `/sales/${item.from_address}`)}>
                              From: {getUserNameFromAddress(item.from_address)}
                            </div>
                            <div style={{ color: '#3291e9', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleRoute(router, `/sales/${item.to_address}`)}>
                              To: {getUserNameFromAddress(item.to_address)}
                            </div>
                            <div>Date: <ReactTimeAgo date={typeof item.block_timestamp === 'number' ? moment.unix(item.block_timestamp) : moment(item.block_timestamp)} locale="en-US" /></div>
                          </div>
                        )}
                      </div>
                    }
                  </Table>
                  :
                  <div className='color-7'>No Activities yet</div>
                }
              </div>
            }
          </div>
        </div>
      }

      <>
        <div className='offer-title' onClick={() => setIsErc1155Listings(!isErc1155Listings)}>
          <div><span aria-hidden="true" className="icon_tag_alt" />&nbsp;&nbsp;Sales</div>
          <span aria-hidden="true" className={`arrow_carrot-${!isErc1155Listings ? 'down' : 'up'} fs-24`} />
        </div>
        {(isErc1155Listings || isLoading) &&
          <div className='offer-body'>
            {isLoading ?
              <div className="w-100 overflow-auto" style={{ maxHeight: 300 }}>
                <Skeleton height={30} />
                <Skeleton height={30} />
                <Skeleton height={30} />
              </div>
              :
              <div className="w-100 overflow-auto" style={{ maxHeight: 300 }}>
                {sales.length > 0 ?
                  <Table className="color-7">
                    <thead>
                      <tr>
                      <th>Owner</th>
                      <th>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                      {sales?.map((item, index) =>
                        <TRow key={index}>
                          <td className='cursor-pointer' style={{ color: '#3291e9' }} onClick={() => handleRoute(router, `/sales/${item.owner_of}`)}>
                            {getUserNameFromAddress(item.owner_of)}
                          </td>
                          <td className='color-b'>{item.amount}</td>
                        </TRow>
                      )}
                    </tbody>
                  </Table>
                  :
                  <div className='color-7'>No Sales yet</div>
                }
              </div>
            }
          </div>
        }
      </>
    </div>
  );
}

export default ItemActivity;
