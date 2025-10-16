import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';

const WalletConnectionModal = () => {
  const { showWalletModal, setShowWalletModal, connectWallet, isConnecting } = useWallet();

  console.log('WalletConnectionModal: showWalletModal =', showWalletModal);

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      logo: 'https://avatars.githubusercontent.com/u/11744586?s=200&v=4',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Connect using WalletConnect mobile app',
      logo: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Gradient/Icon.png',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect using Coinbase Wallet',
      logo: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const handleWalletConnect = async (walletId) => {
    await connectWallet(walletId);
  };

  const handleClose = () => {
    setShowWalletModal(false);
  };

  return (
    <AnimatePresence>
      {showWalletModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
              <p className="text-gray-600">Connect your Web3 wallet to access all features</p>
            </div>

            {/* Wallet Options */}
            <div className="space-y-3 mb-6">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletConnect(wallet.id)}
                  disabled={isConnecting}
                  className={`w-full p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                      <img 
                        src={wallet.logo} 
                        alt={wallet.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.log('Logo failed to load:', wallet.logo, 'for wallet:', wallet.name);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                        onLoad={() => {
                          console.log('Logo loaded successfully:', wallet.logo, 'for wallet:', wallet.name);
                        }}
                      />
                      <div className={`w-full h-full bg-gradient-to-r ${wallet.color} rounded-full flex items-center justify-center text-white text-xl hidden`}>
                        {wallet.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">{wallet.name}</div>
                      <div className="text-sm text-gray-500">{wallet.description}</div>
                    </div>
                    {isConnecting && (
                      <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Real Web3 Wallet Required</p>
                  <p>Connect your actual MetaMask or Coinbase Wallet to access DeFi features, trading, deposits, and loans</p>
                </div>
              </div>
            </div>

            {/* Supported Networks */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">Supported Networks</p>
                  <p>Ethereum, Polygon, BSC, Arbitrum</p>
                </div>
              </div>
            </div>

            {/* Mandatory Connection Notice */}
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-800 text-sm font-medium">
                    Connect your wallet to access trading features
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectionModal;
