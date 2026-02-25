import React, { useEffect, useState } from 'react';
import WertModule from '@wert-io/module-react-component';
import { onSaveRewards } from '../common/web3Api';
import { updateLazyMint, updateOrderData } from '../common/api/authApi';

const CreditCardPayPage = () => {

  const [logs, setLogs] = useState();
  const [logging, setLogging] = useState();
  const [config, setConfig] = useState();

  useEffect(() => {
    const handleData = (event) => {

      if (event.data?.partner_id) {
        const {
          address,
          buttons_border_radius,
          click_id,
          color_background,
          color_buttons,
          commodities,
          commodity_amount,
          container_id,
          height,
          origin,
          partner_id,
          pk_id,
          sc_address,
          sc_id,
          sc_input_data,
          signature,
          theme,
          width,
          orderId,
          lazyMintId
        } = event.data || '-';

        const wertConfig = {
          address,
          buttons_border_radius,
          click_id,
          color_background,
          color_buttons,
          commodities,
          commodity_amount,
          container_id,
          height,
          origin,
          partner_id,
          pk_id,
          sc_address,
          sc_id,
          sc_input_data,
          signature,
          theme,
          width,
          orderId,
          lazyMintId
        };

        setConfig(wertConfig)

        setLogs(JSON.stringify(event.data))
      } else {
        setLogs(JSON.stringify(event.data))
      }
      // Do something when the window is resized
    };

    window.addEventListener('message', handleData);

    return () => {
      window.removeEventListener('message', handleData);
    };
  }, []);



  const onBuySuccess = async () => {
    console.log('Success!')
    config.orderId &&
      (await updateOrderData({
        _id: config.orderId,
        completed: true,
        buyerId: config.address,
      }));

    config.lazyMintId && (await updateLazyMint({ _id: config.lazyMintId, sold: true }));

    const request = { account: config.address, chainId, counts: 1 };
    onSaveRewards(request);

  }

  const onFailed = () => {
    console.log('Failed!')
  }

  return (
    <div>
      {config && <WertModule
        options={{
          ...config,
          listeners: {
            loaded: () => console.log('loaded'),
            'payment-status': data => {
              console.log('Payment status:', data);
              setLogging(JSON.stringify(data))
              // alert(JSON.stringify(data))
              if (data.status === 'success') {
                alert('Success!')
                onBuySuccess();
              } else {
                onFailed();
              }
            }
          }
        }}
      />}
      {/* <div style={{ width: 330, overflow: 'auto', fontSize: 11 }}>{logs}</div>
      <div style={{ width: 330, overflow: 'auto', fontSize: 11, color: '#bbb' }}>{logging}</div> */}
    </div>
  )
};

export default CreditCardPayPage;
