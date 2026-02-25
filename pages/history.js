import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { useDispatch, useSelector } from 'react-redux';
import { updateBadgeCount } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { MetaTag } from '../components/MetaTag';
import { useWeb3Auth } from '../services/web3auth';
import { bulkMarkAsReadUserNotifications, getUserNotifications } from '../common/api/authApi';
import { GOERLI_MINT721_ADDRESS, MAIN_MINT721_ADDRESS, PROD } from '../keys';

const MyHistory = ({ realTimeHistories }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, allUsers } = useWeb3Auth();
  const [tab, setTab] = useState('Notifications')
  const [notifications, setNotifications] = useState([])
  const stepCount = 20;
  const [loadCount, setLoadCount] = useState(stepCount)

  const historyData1 = useMemo(() => realTimeHistories.filter(item => item?.account === user?.account), [realTimeHistories, user?.account])
  const historyData2 = useMemo(() => realTimeHistories.filter(item => item?.opposite === user?.account), [realTimeHistories, user?.account])
  const historyData = [...historyData1, ...historyData2];
  const { nfts } = useSelector(state => state.nfts);

  const token_net = PROD ? 'eth' : 'goerli';
  const token_address = PROD ? MAIN_MINT721_ADDRESS : GOERLI_MINT721_ADDRESS;

  const history = historyData.map(item => {

    const nft = nfts.find((x) => x.token_id === item?.tokenId)
    const metaData = nft?.metadata ? JSON.parse(nft.metadata) : { image: null, name: null, price: null };
    const user = allUsers.find(x => x.account === (item?.opposite || '-'));
    const userMe = allUsers.find(x => x.account === (item?.account || '-'));

    return {
      date: new Date(item?.date),
      tokenId: item?.tokenId,
      tokenConvertId: item?.tokenId?.substr(0, 6) + '...' + item?.tokenId?.substr(-4),
      tag: item?.tag,
      opposite: user?.username,
      oppositeAddress: user?.account,
      asset: metaData.image,
      title: metaData.name,
      price: metaData.price,
      account: userMe?.username,
      address: item?.account
    }
  }).sort(function (a, b) {
    return b.date - a.date
  })

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const loadUserNotifications = async () => {
    if (user?.id) {
      const userNotifications = await getUserNotifications({ userId: user?.id })
      setNotifications(userNotifications)
    }
  }

  const markAsReadUserNotifications = async () => {
    const unReadUserNotifications = notifications.slice(0, loadCount).filter(item => item.status === 'unRead');
    const unReadUserNotificationIds = unReadUserNotifications.map(item => {
      return item.key;
    })
    if (unReadUserNotificationIds.length > 0) {
      await bulkMarkAsReadUserNotifications({ userId: user?.id, ids: unReadUserNotificationIds })
      if (loadCount < notifications.length) {
        const restUnReadUserNotifications = notifications.slice(loadCount, notifications.length).filter(item => item.status === 'unRead');
        dispatch(updateBadgeCount(restUnReadUserNotifications.length));
      } else {
        dispatch(updateBadgeCount(0));
      }
    }
  }

  useEffect(() => {
    loadUserNotifications().then()
  }, [user])

  useEffect(() => {
    if (notifications.length > 0 && loadCount > 0) {
      markAsReadUserNotifications().then()
    }
  }, [notifications, loadCount])

  return (
    <div>
      <MetaTag
        {...{
          title: 'Klik History',
          description: 'Search, Join, and Interact with your favorite communities',
          image: 'https://ucarecdn.com/1bd723ba-565e-4e85-913b-4fc06751746f/Screenshot_1.png',
        }}
      />

      <LayoutPage>
        <LayoutScreen title='My History' description='Create, Accept, Reject, Buy and All Histories'>
          <section className='container mt-5' style={{ minHeight: 500, padding: 0 }}>
            {tab === 'Notifications' ?
                <>
                  <table className='table de-table color-b' style={{ tableLayout: 'fixed' }}>
                    <tr>
                      <th scope='col' style={{ width: '5%' }}>No</th>
                      <th scope='col' style={{ width: '15%' }}>User</th>
                      <th scope='col' style={{ width: '50%' }}>Body</th>
                      <th scope='col' style={{ width: '10%' }}>Type</th>
                      <th scope='col' style={{ width: '20%' }}>Time</th>
                    </tr>
                    {notifications.slice(0, loadCount).map((item, index) => (
                      <tr key={index} className='color-b'>
                        <td>{index + 1}</td>
                        {
                          item.account ?
                            <td className='text-ellipsis color-sky cursor-pointer' onClick={() => handleRouters(`/sales/${item.account}`)}>{item.title}</td>
                            :
                            <td className='text-ellipsis'>{item.title}</td>
                        }
                        <td>{(item.body)}</td>
                        <td>{item.type}</td>
                        <td>{<ReactTimeAgo date={item.createdAt} locale='en-US' />}</td>
                      </tr>
                    ))}
                  </table>
                  {notifications.length > loadCount &&
                    <div className='p-3 text-center'>
                      <button className='btn' onClick={() => setLoadCount(loadCount + stepCount)}>
                        Load More
                      </button>
                    </div>
                  }
                </>
                :
                <div className='row'>
                  <div className='col-lg-12'>
                    <table className='table de-table color-b'>
                      <tr>
                        <th scope='col'>No</th>
                        <th scope='col'>Action</th>
                        <th scope='col'>Item</th>
                        <th scope='col'>From</th>
                        <th scope='col'>To</th>
                        <th scope='col'>Time</th>
                      </tr>

                      {history.map((item, index) => <tr key={index} className='color-b'>
                          <td>{index + 1}</td>
                          <td className='text-uppercase'>{item.tag}</td>
                          <td
                            className='cursor-pointer d-flex flex-row align-items-center'
                            onClick={() => handleRouters(`/nftmarketplace/${token_net}/${token_address}/${item.tokenId}`)}
                          >
                            <picture>
                              <img src={item.asset} alt='' style={{ maxWidth: 80, maxHeight: 40 }} />
                            </picture>
                            <div style={{ marginLeft: 6 }}>
                              {item.title}
                            </div>
                          </td>

                          {item.tag !== 'buy' && <td className='color-sky cursor-pointer' onClick={() => handleRouters(`/sales/${item.address}`)}>{item.account}</td>}
                          {item.tag !== 'buy' && (item.oppositeAddress ? <td className='color-sky cursor-pointer' onClick={() => handleRouters(`/sales/${item.oppositeAddress}`)}>{item.opposite || '-'}</td> : <td>{'-'}</td>)}

                          {item.tag === 'buy' && (item.oppositeAddress ? <td className='color-sky cursor-pointer' onClick={() => handleRouters(`/sales/${item.oppositeAddress}`)}>{item.opposite || '-'}</td> : <td>{'-'}</td>)}
                          {item.tag === 'buy' && <td className='color-sky cursor-pointer' onClick={() => handleRouters(`/sales/${item.address}`)}>{item.account}</td>}

                          <td>{<ReactTimeAgo date={item.date} locale='en-US' />}</td>
                        </tr>
                      )}
                    </table>

                    <div className='spacer-double' />

                    <div className='d-flex align-items-center justify-content-center'>
                      <h2>.</h2>
                    </div>
                  </div>
                </div>
            }
          </section>
        </LayoutScreen>
      </LayoutPage>
    </div>
  );
}

export const getServerSideProps = async () => {

  return {
    props: {
      realTimeHistories: [],
    }
  }
}

export default MyHistory;
