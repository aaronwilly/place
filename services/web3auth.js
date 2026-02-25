import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { ADAPTER_EVENTS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { Web3Auth } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_CONFIG } from './chainConfig';
import { getWalletProvider } from './walletProvider';
import { GetAllUsers, GetUser } from '../common/api/noAuthApi';
import { DEMO_AVATAR, PROD, WEB3AUTH_CLIENTID } from '../keys';

export const Web3AuthContext = createContext({
  web3Auth: null,
  provider: null,
  isLoading: false,
  openlogin: null,
  user: null,
  chain: '',
  isAuthenticated: false,
  allUsers: [],
  balance: 0,

  setChain: () => { },
  setUser: () => { },
  login: async () => { },
  logout: async () => { },
  getUserInfo: async () => { },
  signMessage: async () => { },
  getAccounts: async () => { },
  getBalance: async () => { },
  signTransaction: async () => { },
  signAndSendTransaction: async () => { },
});

export function useWeb3Auth() {
  return useContext(Web3AuthContext);
}

export const Web3AuthProvider = ({ children, web3AuthNetwork }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [web3Auth, setWeb3Auth] = useState(null);
  const [openlogin, setOpenlogin] = useState(null);
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [chain, setChain] = useState(PROD ? 'eth' : 'goerli');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allUsers, setAllUsers] = useState([])
  const [balance, setBalance] = useState(0)

  const setWalletProvider = useCallback((web3authProvider) => {
    const walletProvider = getWalletProvider(chain, web3authProvider, uiConsole);
    setProvider(walletProvider);
    setIsAuthenticated(true);
  }, [chain]);

  useEffect(() => {
    const subscribeAuthEvents = (web3auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
        setOpenlogin(data);
        setWalletProvider(web3auth.provider)
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => console.log('connecting =====>'));

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => setOpenlogin(null));

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => console.log('some error or user has cancelled login request =====>', error));
    };

    const currentChainConfig = CHAIN_CONFIG[chain];

    async function init() {

      try {
        setIsLoading(true);
        const clientId = WEB3AUTH_CLIENTID;
        const web3AuthInstance = new Web3Auth({
          web3AuthNetwork: PROD ? WEB3AUTH_NETWORK.CYAN : WEB3AUTH_NETWORK.TESTNET,
          chainConfig: currentChainConfig,  // get your client id from https://dashboard.web3auth.io
          clientId,
          uiConfig: {
            appName: 'Klik',
            mode: 'dark',
            defaultLanguage: 'en',
          },
          modalZIndex: '99998',
        });
        const adapter = new OpenloginAdapter({ adapterSettings: { network: web3AuthNetwork, clientId, } });
        web3AuthInstance.configureAdapter(adapter);
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    init().then()
  }, [chain, web3AuthNetwork, setWalletProvider]);

  useEffect(() => {
    const getUserFromBackend = async () => {
      const localProvider = await web3Auth.connect()
      const web3Js = new Web3(localProvider)
      const accounts = await web3Js.eth.getAccounts()
      const response = await GetUser({ account: accounts[0]?.toLowerCase() })
      setUser({ ...response, account: response?.account?.toLowerCase() })
      const bal = await web3Js.eth.getBalance(accounts[0])
      setBalance(web3Js.utils.fromWei(bal))
    }

    if (isAuthenticated && web3Auth) {
      getUserFromBackend().then()
    }
  }, [isAuthenticated, web3Auth])

  useEffect(() => {
    login().then()
  }, [chain])

  useEffect(() => {
    const loadUsers = async () => {
      const response = await GetAllUsers()
      if (response) {
        const sortedUsers = response.map(item => {
          return {
            ...item,
            id: item?._id,
            username: item?.username || 'Unnamed',
            avatar: item?.avatar || DEMO_AVATAR,
            lastOnline: null,
          }
        })
        setAllUsers(sortedUsers)
      }
    }

    loadUsers().then()
  }, [user?.account])

  const notExistWeb3Auth = () => {
    console.log('web3auth not initialized yet =====>')
    uiConsole('web3auth not initialized yet')
  }

  const notExistProvider = () => {
    console.log('provider not initialized yet =====>')
    uiConsole('provider not initialized yet')
  }

  const login = async () => {
    if (!web3Auth) {
      notExistWeb3Auth()
      return;
    }

    const localProvider = await web3Auth.connect()
    setWalletProvider(localProvider)

    const userInfo = await web3Auth.getUserInfo()
    const authenticateUser = await web3Auth.authenticateUser()
    const web3Js = new Web3(localProvider)
    const accounts = await web3Js.eth.getAccounts()
    if (userInfo?.idToken) {
      return { ...userInfo, account: accounts[0], accounts }
    } else {
      return { ...authenticateUser, account: accounts[0], accounts }
    }
  };

  const logout = async () => {
    if (!web3Auth) {
      notExistWeb3Auth()
      return;
    }

    await web3Auth.logout()
    setProvider(null)
    setUser(null)
    setIsAuthenticated(false)
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      notExistWeb3Auth()
      return;
    }

    const userInfo = await web3Auth.getUserInfo()
    uiConsole(userInfo)
  };

  const getAccounts = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.getAccounts();
  };

  const getBalance = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.getBalance();
  };

  const signMessage = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.signMessage();
  };

  const signTransaction = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.signTransaction();
  };

  const signAndSendTransaction = async () => {
    if (!provider) {
      notExistProvider()
      return;
    }
    await provider.signAndSendTransaction();
  };

  const uiConsole = (...args) => {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const contextProvider = {
    web3Auth,
    chain,
    provider,
    openlogin,
    user,
    isLoading,
    isAuthenticated,
    allUsers,
    balance,

    setBalance,
    setChain,
    setUser,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    signTransaction,
    signAndSendTransaction,
  };

  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
