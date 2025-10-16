import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDatabase } from '../contexts/DatabaseContext';

const WithdrawalModal = ({ isOpen, onClose }) => {
  const { createWithdrawal, user } = useDatabase();
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const currencies = [
    { 
      symbol: 'BTC', 
      name: 'Bitcoin', 
      logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      minWithdrawal: '0.001',
      fee: '0.0005'
    },
    { 
      symbol: 'ETH', 
      name: 'Ethereum', 
      logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      minWithdrawal: '0.01',
      fee: '0.005'
    },
    { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
      minWithdrawal: '10',
      fee: '1'
    },
    { 
      symbol: 'USDT', 
      name: 'Tether', 
      logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      minWithdrawal: '10',
      fee: '1'
    }
  ];

  const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency);

  const handleWithdrawal = async () => {
    if (!amount || parseFloat(amount) < parseFloat(selectedCurrencyData.minWithdrawal)) {
      setError(`Minimum withdrawal amount is ${selectedCurrencyData.minWithdrawal} ${selectedCurrency}`);
      return;
    }

    if (!walletAddress) {
      setError('Please enter your wallet address');
      return;
    }

    if (user && user.balance < parseFloat(amount)) {
      setError('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      await createWithdrawal(parseFloat(amount), selectedCurrency, walletAddress);
      alert(`Withdrawal of ${amount} ${selectedCurrency} submitted successfully! It will be reviewed by admin.`);
      onClose();
      setAmount('');
      setWalletAddress('');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setAmount('');
      setWalletAddress('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Withdraw Funds</h2>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Current Balance */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Available Balance:</span>
                  <span className="text-blue-900 font-bold">${user.balance?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            )}

            {/* Currency Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Currency</label>
              <div className="grid grid-cols-2 gap-3">
                {currencies.map((currency) => (
                  <button
                    key={currency.symbol}
                    onClick={() => setSelectedCurrency(currency.symbol)}
                    disabled={isProcessing}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedCurrency === currency.symbol
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={currency.logo} 
                        alt={currency.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{currency.symbol}</div>
                        <div className="text-sm text-gray-500">{currency.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter amount in ${selectedCurrency}`}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {selectedCurrency}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Minimum: {selectedCurrencyData.minWithdrawal} {selectedCurrency}
              </div>
            </div>

            {/* Wallet Address Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your {selectedCurrency} Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder={`Enter your ${selectedCurrency} wallet address`}
                disabled={isProcessing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="mt-2 text-sm text-gray-500">
                Make sure the address is correct. Wrong addresses may result in permanent loss.
              </div>
            </div>

            {/* Withdrawal Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Withdrawal Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-medium">{selectedCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span className="font-medium">{selectedCurrencyData.fee} {selectedCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-medium">
                    {selectedCurrency === 'BTC' ? '1-3 hours' : 
                     selectedCurrency === 'ETH' ? '10-30 min' : '5-15 min'}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawal}
                disabled={isProcessing || !amount || !walletAddress}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Withdraw'
                )}
              </button>
            </div>

            {/* Warning */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <p>Withdrawals are processed manually by our admin team. Please allow up to 24 hours for processing.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawalModal;

