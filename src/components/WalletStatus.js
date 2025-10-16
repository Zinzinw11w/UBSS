import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';

const WalletStatus = () => {
  const { 
    isConnected, 
    account, 
    walletType, 
    chainId, 
    balance, 
    formatAddress, 
    disconnectWallet, 
    setShowWalletModal,
    getNetworkName,
    switchNetwork 
  } = useWallet();

  const getWalletLogo = (type) => {
    switch (type) {
      case 'metamask': return 'https://avatars.githubusercontent.com/u/11744586?s=200&v=4';
      case 'walletconnect': return 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Gradient/Icon.png';
      case 'coinbase': return 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4';
      default: return 'https://avatars.githubusercontent.com/u/11744586?s=200&v=4';
    }
  };

  const getWalletName = (type) => {
    switch (type) {
      case 'metamask': return 'MetaMask';
      case 'walletconnect': return 'WalletConnect';
      case 'coinbase': return 'Coinbase';
      default: return 'Wallet';
    }
  };

  const handleNetworkSwitch = async () => {
    // Switch to Ethereum mainnet
    await switchNetwork(1);
  };

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2"
      >
        <div className="flex items-center space-x-2">
          <img 
            src={getWalletLogo(walletType)} 
            alt={getWalletName(walletType)} 
            className="w-6 h-6"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
          />
          <span className="text-lg hidden">🦊</span>
          <div className="text-sm">
            <div className="font-medium text-green-800">{getWalletName(walletType)}</div>
            <div className="text-green-600 font-mono">{formatAddress(account)}</div>
            {balance && (
              <div className="text-green-500 text-xs">
                {balance} ETH
              </div>
            )}
            {chainId && (
              <div className="text-green-500 text-xs">
                {getNetworkName(chainId)}
              </div>
            )}
          </div>
        </div>
        
        {/* Network Switch Button */}
        {chainId && chainId !== 1 && (
          <button
            onClick={handleNetworkSwitch}
            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
            title="Switch to Ethereum Mainnet"
          >
            Switch Network
          </button>
        )}
        
        <button
          onClick={disconnectWallet}
          className="text-green-600 hover:text-green-800 transition-colors duration-200"
          title="Disconnect Wallet"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => setShowWalletModal(true)}
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
    >
      <span>🔐</span>
      <span className="font-medium">Connect Wallet</span>
    </motion.button>
  );
};

export default WalletStatus;
