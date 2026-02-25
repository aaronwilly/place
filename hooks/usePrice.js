import { useState } from 'react';

export default function usePrice() {

  const [ethPrice, setEthPrice] = useState({
    eth: 1645.79, matic: 1.24
  });

  return ethPrice;
}
