import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';

const SignMessageModal = () => {
  const { 
    showSignMessageModal, 
    setShowSignMessageModal, 
    account, 
    signer, 
    signMessage
  } = useWallet();
  
  const [isSigningMessage, setIsSigningMessage] = useState(false);

  const handleSignMessage = async () => {
    if (!signer || !account) {
      // No wallet connected, try to connect first
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Reload the page to trigger wallet connection
        window.location.reload();
        return;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Please install MetaMask or Coinbase Wallet to continue.');
        return;
      }
    }
    
    setIsSigningMessage(true);
    try {
      await signMessage();
      setShowSignMessageModal(false);
    } catch (error) {
      console.error('Failed to sign message:', error);
      alert('Failed to sign message. Please try again.');
    } finally {
      setIsSigningMessage(false);
    }
  };

  const handleCancel = () => {
    setShowSignMessageModal(false);
  };


  return (
    <AnimatePresence>
      {showSignMessageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-white text-lg sm:text-xl font-bold mb-2">
                Sign Message for Login
              </h2>
            </div>

            {/* Account Info */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                <div className="text-gray-300 text-xs sm:text-sm mb-2">Account:</div>
                <div className="text-white font-mono text-xs sm:text-sm break-all">
                  {account || '0x0000000000000000000000000000000000000000'}
                </div>
              </div>
            </div>

            {/* Origin Info */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                <div className="text-gray-300 text-xs sm:text-sm mb-2">Origin:</div>
                <div className="text-white font-mono text-xs sm:text-sm">
                  {window.location.origin}
                </div>
              </div>
            </div>

            {/* Connect to Wallet Text */}
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-gray-300 text-xs sm:text-sm">Connect to Wallet</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base"
                disabled={isSigningMessage}
              >
                Cancel
              </button>
              <button
                onClick={handleSignMessage}
                className="flex-1 bg-white hover:bg-gray-100 text-black py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base"
                disabled={isSigningMessage}
              >
                {isSigningMessage ? 'Signing...' : 'Sign Message'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignMessageModal;
