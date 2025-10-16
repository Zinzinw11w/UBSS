import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false); // Optional wallet connection
  const [showSignMessageModal, setShowSignMessageModal] = useState(false); // Sign message modal
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);

  // Check if user has previously connected
  useEffect(() => {
    console.log('WalletContext: Checking wallet connection status...');
    const savedConnection = localStorage.getItem('walletConnected');
    const savedAccount = localStorage.getItem('walletAccount');
    const savedWalletType = localStorage.getItem('walletType');
    
    console.log('Saved connection:', savedConnection, savedAccount, savedWalletType);
    
    if (savedConnection === 'true' && savedAccount && savedWalletType) {
      console.log('Attempting to reconnect wallet...');
      // Try to reconnect to the saved wallet
      reconnectWallet(savedWalletType);
    }
  }, []);

  // Auto-show sign message modal when users visit website
  useEffect(() => {
    const autoShowSignMessage = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Auto-connect wallet silently
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const account = await signer.getAddress();
            const network = await provider.getNetwork();
            
            setProvider(provider);
            setSigner(signer);
            setAccount(account);
            setChainId(network.chainId);
            setIsConnected(true);
            
            // Check if signature is recent (within 24 hours)
            const savedSignature = localStorage.getItem('walletSignature');
            const savedTimestamp = localStorage.getItem('walletTimestamp');
            const isRecent = savedTimestamp && (Date.now() - parseInt(savedTimestamp)) < 24 * 60 * 60 * 1000;
            
            if (!savedSignature || !isRecent) {
              // Show sign message modal directly
              setTimeout(() => {
                setShowSignMessageModal(true);
              }, 1000);
            }
          } else {
            // No wallet connected, show sign message modal anyway
            setTimeout(() => {
              setShowSignMessageModal(true);
            }, 1000);
          }
        } catch (error) {
          console.error('Error auto-connecting wallet:', error);
          // Show sign message modal even if there's an error
          setTimeout(() => {
            setShowSignMessageModal(true);
          }, 1000);
        }
      } else {
        // No ethereum provider, show sign message modal
        setTimeout(() => {
          setShowSignMessageModal(true);
        }, 1000);
      }
    };

    // Auto-show after a short delay
    const timer = setTimeout(autoShowSignMessage, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      localStorage.setItem('walletAccount', accounts[0]);
      fetchBalance(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    window.location.reload(); // Reload to ensure proper network handling
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const reconnectWallet = async (type) => {
    try {
      if (type === 'metamask' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          const network = await provider.getNetwork();
          
          setProvider(provider);
          setSigner(signer);
          setAccount(account);
          setChainId(network.chainId);
          setWalletType(type);
          setIsConnected(true);
          setShowWalletModal(false);
          
          await fetchBalance(account);
        }
      }
    } catch (error) {
      console.error('Reconnection failed:', error);
      disconnectWallet();
    }
  };

  const connectWallet = async (type) => {
    setIsConnecting(true);
    
    try {
      let provider, signer, account, network;
      
      if (type === 'metamask') {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
        }

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        account = await signer.getAddress();
        network = await provider.getNetwork();
        
        // Check if user is on a supported network
        const supportedChains = [1, 137, 56, 42161]; // Ethereum, Polygon, BSC, Arbitrum
        const chainId = Number(network.chainId); // Convert BigInt to number
        if (!supportedChains.includes(chainId)) {
          throw new Error(`Please switch to a supported network. Current: ${network.name}`);
        }
        
      } else if (type === 'walletconnect') {
        // For WalletConnect, we'll use a simplified approach
        // In production, you'd integrate with WalletConnect SDK
        throw new Error('WalletConnect integration coming soon. Please use MetaMask for now.');
        
      } else if (type === 'coinbase') {
        // For Coinbase Wallet
        if (typeof window.ethereum === 'undefined') {
          throw new Error('Coinbase Wallet is not installed. Please install Coinbase Wallet to continue.');
        }
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        account = await signer.getAddress();
        network = await provider.getNetwork();
        
        // Check if user is on a supported network
        const supportedChains = [1, 137, 56, 42161]; // Ethereum, Polygon, BSC, Arbitrum
        const chainId = Number(network.chainId); // Convert BigInt to number
        if (!supportedChains.includes(chainId)) {
          throw new Error(`Please switch to a supported network. Current: ${network.name}`);
        }
      }
      
      if (account) {
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);
        setAccount(account);
        setWalletType(type);
        setChainId(network.chainId);
        setShowWalletModal(false);
        
        // Save to localStorage
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAccount', account);
        localStorage.setItem('walletType', type);
        
        // Fetch balance
        await fetchBalance(account);
        
        // Auto-show sign message modal for authentication
        setTimeout(() => {
          setShowSignMessageModal(true);
        }, 500);
        
        return true;
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      // More user-friendly error messages
      let errorMessage = error.message;
      if (error.message.includes('User rejected')) {
        errorMessage = 'Connection cancelled by user';
      } else if (error.message.includes('not installed')) {
        errorMessage = 'Please install MetaMask or Coinbase Wallet to continue';
      } else if (error.message.includes('getAddress is not a function')) {
        errorMessage = 'Wallet connection error. Please try again.';
      }
      
      alert(`Failed to connect ${type}: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
    
    return false;
  };

  const fetchBalance = async (accountAddress) => {
    if (!provider || !accountAddress) return;
    
    try {
      const balance = await provider.getBalance(accountAddress);
      const balanceInEth = ethers.formatEther(balance);
      setBalance(parseFloat(balanceInEth).toFixed(4));
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const signMessage = async () => {
    if (!signer || !account) {
      throw new Error('No wallet connected');
    }

    setIsSigning(true);
    try {
      // Create a unique message for authentication
      const timestamp = Date.now();
      const message = `welcome login${timestamp}`;
      
      // Sign the message
      const signature = await signer.signMessage(message);
      
      console.log('Message signed successfully:', signature);
      
      // Store the signature in localStorage for session management
      localStorage.setItem('walletSignature', signature);
      localStorage.setItem('walletMessage', message);
      localStorage.setItem('walletTimestamp', timestamp.toString());
      
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    } finally {
      setIsSigning(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setWalletType(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setBalance(null);
    setShowWalletModal(false);
    
    // Clear localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAccount');
    localStorage.removeItem('walletType');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum',
      137: 'Polygon',
      56: 'BSC',
      42161: 'Arbitrum',
      10: 'Optimism',
      250: 'Fantom'
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      return false;
    }
  };

  const value = {
    isConnected,
    account,
    walletType,
    showWalletModal,
    showSignMessageModal,
    isConnecting,
    isSigning,
    provider,
    signer,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    formatAddress,
    setShowWalletModal,
    setShowSignMessageModal,
    signMessage,
    getNetworkName,
    switchNetwork,
    fetchBalance
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
