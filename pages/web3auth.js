import { WALLET_ADAPTERS } from '@web3auth/base';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { useWeb3Auth } from '../services/web3auth';
import { WEB3AUTH_CLIENTID } from '../keys';

const Web3authTest = () => {

  const {
    provider,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    signTransaction,
    signAndSendTransaction,
    web3Auth,
    chain
  } = useWeb3Auth();

  const loggedInView = (
    <>

      <button onClick={() => {}}>Get Chain</button>

      <button onClick={getUserInfo}>Get User Info</button>
      <button onClick={getAccounts}>Get Accounts</button>
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={signMessage}>Sign Message</button>
      {(web3Auth?.connectedAdapterName === WALLET_ADAPTERS.OPENLOGIN || chain === 'solana') &&
        <button onClick={signTransaction}>Sign Transaction</button>
      }
      <button onClick={signAndSendTransaction}>Sign and Send Transaction</button>
      <button onClick={logout}>Log Out</button>

      <div id="console">
        <p></p>
      </div>
    </>
  );

  const unLoggedInView = (
    <button onClick={login}>Login</button>
  );

  return (
    <LayoutPage>
      <LayoutScreen>
        {provider ? loggedInView : unLoggedInView}
        {WEB3AUTH_CLIENTID}
      </LayoutScreen>
    </LayoutPage>
  );
};

export default Web3authTest;
